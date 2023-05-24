'use client';

import SdfCanvas from './sdf-canvas';

import { CreateGroupNode, CreateSphereNode, CreateTransformNode } from '@/lib/sdf-node';

export default function SdfEditor() {
  return (
    <SdfCanvas
      root={CreateGroupNode([
        CreateGroupNode([
          CreateTransformNode({ translate: [-0.8, 0.3, 0] }),
          CreateSphereNode(0.3),
        ]),
        CreateGroupNode([
          CreateTransformNode({ translate: [0.6, -0.2, 0.1] }),
          CreateSphereNode(0.4),
        ]),
        CreateGroupNode([
          CreateTransformNode({ translate: [0, 0.1, -0.8] }),
          CreateSphereNode(0.35),
        ]),
      ])}
    />
  );
}
