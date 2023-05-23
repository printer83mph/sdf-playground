import { mat4 } from 'gl-matrix'

import fragmentSource from '@/glsl/sdf.frag'
import vertexSource from '@/glsl/sdf.vert'

function createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    throw `Could not compile WebGL shader. \n\n${info}`
  }

  return shader
}

export function setupGL(gl: WebGL2RenderingContext) {
  const program = gl.createProgram()!

  const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER)
  const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER)
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    throw `Could not compile WebGL program. \n\n${info}`
  }

  gl.useProgram(program)

  const attribLocations = {
    pos: gl.getAttribLocation(program, 'vs_Pos'),
    uv: gl.getAttribLocation(program, 'vs_UV'),
  }

  const uniformLocations = {
    camera: gl.getUniformLocation(program, 'u_Camera'),
    scene: gl.getUniformLocation(program, 'u_Scene'),
  }

  // init pos buffer
  const posBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    Float32Array.from(
      [
        [-1, -1, 0, 1],
        [-1, 1, 0, 1],
        [1, 1, 0, 1],
        [1, -1, 0, 1],
      ].flat()
    ),
    gl.STATIC_DRAW
  )
  gl.vertexAttribPointer(attribLocations.pos, 4, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attribLocations.pos)

  // init uv buffer
  const uvBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    Float32Array.from(
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ].flat()
    ),
    gl.STATIC_DRAW
  )
  gl.vertexAttribPointer(attribLocations.uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attribLocations.uv)

  const setCameraMatrix = (mat: mat4) => {
    gl.uniformMatrix4fv(uniformLocations.camera, false, mat)
  }

  const setScene = (scene: mat4[]) => {
    // TODO: do we really want 100 node limit? maybe 1000? man...
    const array = new Float32Array(100 * 16)
    // eslint-disable-next-line unicorn/no-array-for-each
    scene.forEach((matrix, idx) => {
      for (let i = 0; i < 16; i++) {
        array[idx * 16 + i] = matrix[i]
      }
    })
    // eslint-enable
    gl.uniformMatrix4fv(uniformLocations.scene, false, array)
  }

  const draw = () => {
    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
  }

  return { gl, program, attribLocations, uniformLocations, setCameraMatrix, setScene, draw }
}

export type GLInfo = ReturnType<typeof setupGL>
