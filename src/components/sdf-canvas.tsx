import { useEffect, useRef } from 'react'

import encode from '@/lib/encode'
import type { GroupNode } from '@/lib/sdf-node'
import { GLInfo, setupGL } from '@/lib/webgl'

export default function SdfCanvas({ root }: { root: GroupNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const references = useRef<GLInfo>(null!)

  // initial setup
  useEffect(() => {
    const gl = canvasRef.current.getContext('webgl2')!
    references.current = setupGL(gl)

    const drawLoop = () => {
      references.current.draw()
      requestAnimationFrame(drawLoop)
    }

    requestAnimationFrame(drawLoop)
  }, [])

  useEffect(() => {
    const encodedScene = encode(root)
    references.current.setScene(encodedScene)
  }, [root])

  return <canvas ref={canvasRef} width={800} height={600} />
}
