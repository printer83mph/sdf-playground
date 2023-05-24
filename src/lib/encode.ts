import { mat4, vec3, vec4 } from 'gl-matrix';

import type { GroupNode, NodeType, SdfNode, ShapeNode, Shape, BlendMode } from './sdf-node';

// prettier-ignore
const endMarkerMat4 = mat4.fromValues(
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
)

export default function encode(node: SdfNode) {
  const matrices = (node as GroupNode).children.flatMap((child) => encodeMap[child.type](child));
  matrices.push(endMarkerMat4);
  return matrices;
}

/**
 * group matrix: sets blend mode and translate/rotate
 * sets blend mode and/or translate + rotate
 *
 *   <blend-mode>,  <tx>,            <rx>,         X
 *   <blend-param>, <ty>,            <ry>,         X
 *   <blend-param>, <tz>,            <rz>,         0
 *   <use-blend>,   <use-translate>, <use-rotate>, -1
 */

const blendModeMap: {
  [key in BlendMode['mode']]: {
    key: number;
    params: (blend: BlendMode) => [number, number];
  };
} = {
  // union and intersect both have no parameters.
  union: { key: 0, params: () => [0, 0] },
  intersect: { key: 1, params: () => [0, 0] },
};

function createGroupMatrix({
  blend,
  translate,
  rotate,
}: {
  blend?: BlendMode;
  translate?: vec3;
  rotate?: vec3;
}): mat4 {
  const blendModeKey = blend ? blendModeMap[blend.mode].key : 0;
  const [blendA, blendB] = blend ? blendModeMap[blend.mode].params(blend) : [0, 0];

  const blendColumn: vec4 = [blendModeKey, blendA, blendB, blend ? 1 : 0];
  const translateColumn: vec4 = translate
    ? [translate[0], translate[1], translate[2], 1]
    : [0, 0, 0, 0];
  const rotateColumn: vec4 = rotate ? [rotate[0], rotate[1], rotate[2], 1] : [0, 0, 0, 0];

  // column-major
  return [blendColumn, translateColumn, rotateColumn, [0, 0, 0, -1]].flat() as mat4;
}

// TODO: how the fuck will different blend modes work if we only want them to work within groups..?
//       we might have to actually use recursion... aghhhh

/**
 * color matrix, added if color is set:
 * potentially material info also but for now just color
 *
 *   <R>, X, X, X
 *   <G>, X, X, X
 *   <B>, X, X, 1
 *   X,   X, X, -1
 */

// TODO: function createColorMatrix

/**
 * sphere matrix
 *
 *   <radius>, X, X, X
 *   X,        X, X, X
 *   X,        X, X, 0
 *   X,        X, X, 1
 */

// TODO: function createShapeMatrix

// TODO: all this shit...
const encodeMap: { [key in NodeType]: (node: SdfNode) => mat4[] } = {
  // group
  group: (node) => {
    return [];
  },
  // transform
  transform: (node) => {
    return [];
  },
  // shape
  shape: (node) => {
    return [];
  },
};

const encodeShapeMap: { [key in Shape['type']]: (node: ShapeNode) => mat4 } = {
  // sphere: 2nd to last index is 0
  sphere: (node) => mat4.create(),
};
