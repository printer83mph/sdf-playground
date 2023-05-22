attribute vec4 at_Pos;
attribute vec2 at_UV;

varying vec2 va_UV;

void main() {
  gl_Position = at_Pos;
  va_UV = at_UV;
}