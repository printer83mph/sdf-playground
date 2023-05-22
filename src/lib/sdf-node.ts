import type { vec3 } from 'gl-matrix'

export type NodeType = 'group' | 'transform' | 'shape'

export interface SdfNode {
  type: NodeType
}

// --------- --------- --------- ROOT NODE --------- --------- ---------

export interface GroupNode extends SdfNode {
  type: 'group'
  children: SdfNode[]
}

export function CreateGroupNode(children?: SdfNode[]): GroupNode {
  return {
    type: 'group',
    children: children ?? [],
  }
}

// --------- --------- --------- TRANSFORM NODE --------- --------- ---------

export interface TransformNode extends SdfNode {
  type: 'transform'
  translate: vec3
  rotate: vec3
  scale: vec3
}

export function CreateTransformNode({
  translate,
  rotate,
  scale,
}: {
  translate?: vec3
  rotate?: vec3
  scale?: vec3
} = {}): TransformNode {
  return {
    type: 'transform',
    translate: translate ?? [0, 0, 0],
    rotate: rotate ?? [0, 0, 0],
    scale: scale ?? [1, 1, 1],
  }
}

// --------- --------- --------- SHAPE NODE --------- --------- ---------

// TODO: more shapes!
export type ShapeType = 'sphere' // | box | ...etc

export interface ShapeNode extends SdfNode {
  type: 'shape'
  shape: ShapeType
}

export interface SphereNode extends ShapeNode {
  shape: 'sphere'
  radius: number
}

export function CreateSphereNode(radius: number): SphereNode {
  return { type: 'shape', shape: 'sphere', radius }
}
