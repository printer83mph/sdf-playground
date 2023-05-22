import encode from '@/lib/encode'
import type { GroupNode } from '@/lib/sdf-node'
import { useEffect, useRef } from 'react'

export default function SdfCanvas({ root }: { root: GroupNode }) {
  const canvasRef = useRef(null!)

  useEffect(() => {
    const encodedScene = encode(root)
    // TODO: update shader uniform values with scene
  }, [root])

  return <canvas ref={canvasRef} />
}
