#version 300 es
precision highp float;

#define FLT_MAX 3.402823466e+38

uniform mat4 u_Camera;
uniform mat4 u_Scene[100];

in vec2 fs_UV;

out vec4 fragColor;

const float FOV_Y = 3.1415 / 3.;
const float TAN_ALPHA = tan(FOV_Y / 2.);

const float ASPECT = 4. / 3.;

// --- UTIL ---

mat3 rotateX(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(
    1., 0., 0.,
    0., c, s,
    0., -s, c
  );
}

mat3 rotateY(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(
    c, 0., -s,
    0., 1., 0.,
    s, 0., c
  );
}

mat3 rotateZ(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(
    c, s, 0.,
    -s, c, 0.,
    0., 0., 1.
  );
}

struct Ray {
  vec3 origin;
  vec3 direction;
};

Ray getRay() {
  vec2 ndcCoords = fs_UV * 2. - 1.;

  vec3 rayOrigin = vec3(u_Camera * vec4(0, 0, 0, 1));

  vec3 right = vec3(u_Camera[0]);
  vec3 up = vec3(u_Camera[1]);
  vec3 forward = -vec3(u_Camera[2]);

  vec3 ref = rayOrigin + forward;
  vec3 V = up * TAN_ALPHA;
  vec3 H = right * ASPECT * TAN_ALPHA;

  vec3 p = ref + ndcCoords.x * H + ndcCoords.y * V;

  vec3 rayDirection = normalize(p - rayOrigin);

  return Ray(rayOrigin, rayDirection);
}

// --- SDF FUNCTIONS ---

float sdfSphere(vec3 query, float radius) {
  return length(query) - radius;
}

float sdfShape(inout vec3 query, inout mat4 shapeMatrix) {
  // sphere
  if (abs(shapeMatrix[2][3] - 0.) < 0.01) {
    // radius is at 0, 0
    return sdfSphere(query, shapeMatrix[0][0]);
  }
  return FLT_MAX;
}

// --- MAIN SDF FUNCTION ---

// this gets "pushed" and "popped" (multiple exist on stack)
struct LocalQueryState {
  vec3 query;
  vec3 color; // current color (closest indexed guy)
};

LocalQueryState defaultLocalState(vec3 query) {
  return LocalQueryState(query, vec3(1.));
}

// this gets modified only if we find a smaller distance
struct GlobalQueryState {
  int index; // index to query next
  float minDistance;
  vec3 color;
};

GlobalQueryState defaultGlobalState() {
  return GlobalQueryState(0, FLT_MAX, vec3(1.));
}

#define GROUP_BEGIN_MATRIX -1.
#define GROUP_END_MATRIX -2.
#define END_MATRIX 0.
#define SHAPE_MATRIX 1.
#define TRANSFORM_MATRIX 2.

// TODO: crucial that we keep maximum stack size down for performance
#define STACK_SIZE 3
#define FLOAT_THRESHOLD 0.01

GlobalQueryState sdf(vec3 query) {
  GlobalQueryState globalState = defaultGlobalState();
  LocalQueryState stack[STACK_SIZE];
  stack[0] = defaultLocalState(query);
  int stackIdx = 0;
  
  while (globalState.index < 100) {
    globalState.color.b += 0.01;
    mat4 currentMatrixCopy = u_Scene[globalState.index];
    globalState.index++;

    float matType = currentMatrixCopy[3][3];
    // full stop end marker
    if (abs(matType - END_MATRIX) < FLOAT_THRESHOLD) {
      break;
    }
    // group begin marker
    else if (abs(matType - GROUP_BEGIN_MATRIX) < FLOAT_THRESHOLD) {
      // add copy on top of stack
      stack[stackIdx + 1] = stack[stackIdx];
      ++stackIdx;
      continue;
    }
    // group end marker
    else if (abs(matType - GROUP_END_MATRIX) < FLOAT_THRESHOLD) {
      // decrease stack
      --stackIdx;
      continue;
    }
    // shape matrix
    else if (abs(matType - SHAPE_MATRIX) < FLOAT_THRESHOLD) {

      float dist = sdfShape(stack[stackIdx].query, currentMatrixCopy);

      // check if this shape has priority
      if (dist <= globalState.minDistance) {
        // copy stuff from local state to global
        globalState.minDistance = dist;
        globalState.color = stack[stackIdx].color;
      }

      continue;
    }
    // transform matrix
    else if (abs(matType - TRANSFORM_MATRIX) < FLOAT_THRESHOLD) {
      vec3 translate = -vec3(currentMatrixCopy[0]);
      vec3 rotate = -vec3(currentMatrixCopy[1]);
      vec3 scale = 1. / vec3(currentMatrixCopy[2]);

      stack[stackIdx].query += translate;
      // TODO: full transform logic... rotate + scale... update query in stack
    }
  }

  return globalState;
}

// --- RAY MARCHING ---

#define SDF_THRESHOLD 0.001
#define MAX_ITERATIONS 64

struct MarchResult {
  bool hit;
  float t;
  vec3 color;
};

MarchResult rayMarch(Ray ray) {
  float t = 0.;

  int iterations = 0;
  do {
    vec3 samplePoint = ray.origin + t * ray.direction;
    GlobalQueryState finalQueryState = sdf(samplePoint);

    float maxMarchDist = finalQueryState.minDistance;
    // float maxMarchDist = sdfSphere(samplePoint, 0.5);

    if (maxMarchDist < SDF_THRESHOLD) {
      return MarchResult(true, t, finalQueryState.color);
    }

    t += maxMarchDist + SDF_THRESHOLD;

  } while (++iterations < MAX_ITERATIONS);

  // we didn't hit anything
  return MarchResult(false, 0., vec3(0.));
}

vec3 getNormal(vec3 query) {
  float h = 0.00001;
  vec2 k = vec2(1, -1);
  return normalize(
    k.xyy * sdf(query + k.xyy * h).minDistance +
    k.yyx * sdf(query + k.yyx * h).minDistance +
    k.yxy * sdf(query + k.yxy * h).minDistance +
    k.xxx * sdf(query + k.xxx * h).minDistance
  );
}

void main() {
  Ray ray = getRay();

  // default background color
  vec3 finalColor = vec3(
    ray.direction[0] / 2. + 1.,
    ray.direction[1] / 2. + 1.,
    ray.direction[2] / 2. + 1.
  );
  
  MarchResult marchResult = rayMarch(ray);

  if (marchResult.hit) {
    vec3 intersectPoint = ray.origin + ray.direction * marchResult.t;

    vec3 nor = getNormal(intersectPoint);

    // TODO: move lighting to uniform inputs
    float directTerm = (dot(nor, vec3(0.5, 0.65, 0.4)) / 2. + 0.5) * 1.8;
    float ambientTerm = 0.6;

    finalColor = marchResult.color * (directTerm + ambientTerm);
  }

  // reinhard-jodie operator
  float luminance = dot(finalColor, vec3(0.2126, 0.7152, 0.0722));
  vec3 tColor = finalColor / (vec3(1.) + finalColor);
  vec3 tonemappedColor = mix(finalColor / (vec3(1.) + luminance), tColor, tColor);

  // gamma correction
  fragColor = vec4(pow(tonemappedColor, vec3(1. / 2.2)), 1.);
}
