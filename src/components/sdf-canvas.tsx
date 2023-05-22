import { useEffect, useRef } from 'react'

import useMouseControls from '@/hooks/use-mouse-controls'
import encode from '@/lib/encode'
import type { GroupNode } from '@/lib/sdf-node'
import { GLInfo, setupGL } from '@/lib/webgl'

export default function SdfCanvas({ root }: { root: GroupNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(undefined!)
  const references = useRef<GLInfo>(undefined!)

  // initial setup
  useEffect(() => {
    const gl = canvasRef.current.getContext('webgl2')!
    references.current = setupGL(gl)
    let frameRequestId: number

    const drawLoop = () => {
      references.current.draw()
      frameRequestId = requestAnimationFrame(drawLoop)
    }
    frameRequestId = requestAnimationFrame(drawLoop)

    return () => {
      cancelAnimationFrame(frameRequestId)
    }
  }, [])

  useMouseControls({
    canvasRef,
    dragButtons: [0, 1, 2],
    onDrag(button, dist) {
      console.log('dragged', button, 'by', dist)
    },
  })

  useEffect(() => {
    const encodedScene = encode(root)
    references.current.setScene(encodedScene)
  }, [root])

  return <canvas ref={canvasRef} width={800} height={600} />
}
