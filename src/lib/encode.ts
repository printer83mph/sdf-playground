import { mat4 } from 'gl-matrix';

import type {
  GroupNode,
  NodeType,
  SdfNode,
  ShapeNode,
  ShapeType,
  SphereNode,
  TransformNode,
} from './sdf-node';

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

// marker for when a group "begins"
// prettier-ignore
const groupBeginMat4 = mat4.fromValues(
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, -1,
)

// marker for when a group "ends"
// prettier-ignore
const groupEndMat4 = mat4.fromValues(
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, 0,
  0, 0, 0, -2,
)

const encodeMap: { [key in NodeType]: (node: SdfNode) => mat4[] } = {
  // group: has begin/end markers, then content inside
  group: (node) => {
    return [
      groupBeginMat4,
      ...(node as GroupNode).children.flatMap((child) => encodeMap[child.type](child)),
      groupEndMat4,
    ];
  },
  // transform: last index is 2
  transform: (node) => {
    const { translate, rotate, scale } = node as TransformNode;
    // prettier-ignore
    return [
      mat4.fromValues(
        translate[0], translate[1], translate[2], 0,
        rotate[0], rotate[1], rotate[2], 0,
        scale[0], scale[1], scale[2], 0,
        0, 0, 0, 2
      )
    ]
  },
  // shape: last index is 1
  shape: (node) => [encodeShapeMap[(node as ShapeNode).shape](node as ShapeNode)],
};

const encodeShapeMap: { [key in ShapeType]: (node: ShapeNode) => mat4 } = {
  // sphere: 2nd to last index is 0
  sphere: (node) => {
    // prettier-ignore
    return mat4.fromValues(
      (node as SphereNode).radius, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 1,
    )
  },
};
