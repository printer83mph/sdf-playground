'use client'

import SdfCanvas from './sdf-canvas'

import { CreateGroupNode, CreateSphereNode } from '@/lib/sdf-node'

export default function SdfEditor() {
  return <SdfCanvas root={CreateGroupNode([CreateSphereNode(0.6)])} />
}
