import type { vec3 } from 'gl-matrix';

export type NodeType = 'group' | 'transform' | 'shape';

// TODO: more BlendModes
export type BlendMode = { mode: 'union' } | { mode: 'intersect' };

// --------- --------- --------- GROUP NODE --------- --------- ---------

export interface GroupNode {
  type: 'group';
  children: SdfNode[];
  translate?: vec3;
  rotate?: vec3;
  color?: vec3;
  blend?: BlendMode;
}

export function CreateGroupNode(
  properties: Omit<GroupNode, 'type' | 'children'>,
  children?: SdfNode[]
): GroupNode {
  return {
    type: 'group',
    children: children ?? [],
    ...properties,
  };
}

// --------- --------- --------- SHAPE NODE --------- --------- ---------

// TODO: more shapes!
export type Shape = { type: 'sphere'; radius: number } /* | box | torus | ...etc */;

export interface ShapeNode {
  type: 'shape';
  shape: Shape;
  translate?: vec3;
  rotate?: vec3;
}

export function CreateSphereNode(
  radius: number,
  transform?: { translate?: vec3; rotate?: vec3 }
): ShapeNode {
  return { type: 'shape', shape: { type: 'sphere', radius }, ...transform };
}

export type SdfNode = GroupNode | ShapeNode;
