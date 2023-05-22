import { mat4 } from 'gl-matrix'

import vertexSource from '@/glsl/sdf.vert'
import fragmentSource from '@/glsl/sdf.frag'

function createShader(
  gl: WebGL2RenderingContext,
  sourceCode: string,
  type: number
) {
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
    proj: gl.getUniformLocation(program, 'u_Proj'),
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
        [1, 0],
        [1, 1],
        [0, 1],
      ].flat()
    ),
    gl.STATIC_DRAW
  )
  gl.vertexAttribPointer(attribLocations.uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attribLocations.uv)

  // set uniform proj matrix
  gl.uniformMatrix4fv(uniformLocations.proj, false, mat4.create())

  const setScene = (scene: mat4[]) => {
    const array = new Float32Array(scene.length * 16)
    scene.forEach((matrix, idx) => {
      for (let i = 0; i < 16; i++) {
        array[idx + i] = matrix[i]
      }
    })
    gl.uniformMatrix4fv(uniformLocations.scene, false, array)
  }

  const draw = () => {
    gl.clearColor(0, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
  }

  return { gl, program, attribLocations, uniformLocations, setScene, draw }
}

export type GLInfo = ReturnType<typeof setupGL>
