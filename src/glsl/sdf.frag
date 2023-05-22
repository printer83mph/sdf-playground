#version 300 es
precision highp float;

uniform mat4 u_Camera;
uniform mat4 u_Scene[100];

in vec2 fs_UV;

out vec4 fragColor;

const float FOV_Y = 3.14f / 2.f;
const float TAN_ALPHA = tan(FOV_Y / 2.f);

const float ASPECT = 4.f / 3.f;

void main() {
  vec2 ndcCoords = fs_UV * 2.f - 1.f;

  vec3 rayOrigin = vec3(u_Camera * vec4(0, 0, 0, 1));

  vec3 right = vec3(u_Camera[0]);
  vec3 up = vec3(u_Camera[1]);
  vec3 forward = -vec3(u_Camera[2]);

  vec3 ref = rayOrigin + forward;
  vec3 V = up * TAN_ALPHA;
  vec3 H = right * ASPECT * TAN_ALPHA;

  vec3 p = ref + ndcCoords.x * H + ndcCoords.y * V;

  vec3 rayDirection = normalize(p - rayOrigin);

  fragColor = vec4(
    rayDirection[0] / 2.f + 1.f,
    rayDirection[1] / 2.f + 1.f,
    rayDirection[2] / 2.f + 1.f,
    1.f
  );
}
