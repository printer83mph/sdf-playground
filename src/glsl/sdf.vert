#version 300 es
precision highp float;

uniform mat4 u_Proj;

in vec4 vs_Pos;
in vec2 vs_UV;

out vec2 fs_UV;

void main() {
  gl_Position = u_Proj * vs_Pos;
  fs_UV = vs_UV;
}
