import { useEffect, useRef } from 'react'

import useMouseControls from '@/hooks/use-mouse-controls'
import encode from '@/lib/encode'
import OrbitControls from '@/lib/orbit-controls'
import type { GroupNode } from '@/lib/sdf-node'
import { GLInfo, setupGL } from '@/lib/webgl'

export default function SdfCanvas({ root }: { root: GroupNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(undefined!)
  const glReferences = useRef<GLInfo>(undefined!)
  const orbitControls = useRef<OrbitControls>(undefined!)

  // initial setup
  useEffect(() => {
    orbitControls.current = new OrbitControls()

    const gl = canvasRef.current.getContext('webgl2')!
    glReferences.current = setupGL(gl)

    glReferences.current.setCameraMatrix(orbitControls.current.viewTransform)

    let frameRequestId: number
    const drawLoop = () => {
      glReferences.current.draw()
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
    onDrag(button, [dx, dy]) {
      switch (button) {
        case 0: {
          orbitControls.current.addPitch(-dy * 0.3)
          orbitControls.current.addYaw(-dx * 0.3)
          break
        }
        case 1: {
          orbitControls.current.moveTargetLocal([-dx * 0.005, dy * 0.005, 0])
          break
        }
        case 2: {
          orbitControls.current.addDistance(-dy * 0.01)
          break
        }
        default: {
          return
        }
      }
      orbitControls.current.computeViewTransform()
      glReferences.current.setCameraMatrix(orbitControls.current.viewTransform)
    },
  })

  // encode + update scene data
  useEffect(() => {
    const encodedScene = encode(root)
    glReferences.current.setScene(encodedScene)
    console.log(encodedScene)
  }, [root])

  return <canvas ref={canvasRef} width={800} height={600} />
}
