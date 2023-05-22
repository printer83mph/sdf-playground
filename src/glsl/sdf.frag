#version 300 es
precision highp float;

uniform mat4 u_Scene[100];

in vec2 fs_UV;

out vec4 fragColor;

void main() {
  fragColor = vec4(fs_UV.x, fs_UV.y, 1.f, 1.f);
}
