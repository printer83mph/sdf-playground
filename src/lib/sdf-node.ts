import type { vec3 } from 'gl-matrix';

export type NodeType = 'group' | 'transform' | 'shape';

export interface SdfNode {
  type: NodeType;
}

// TODO: more BlendModes
export type BlendMode = { mode: 'union' } | { mode: 'intersect' };

// --------- --------- --------- GROUP NODE --------- --------- ---------

export interface GroupNode extends SdfNode {
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

export interface ShapeNode extends SdfNode {
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
