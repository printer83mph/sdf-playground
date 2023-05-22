varying vec2 va_UV;

void main() {
  gl_FragColor = vec4(va_UV.x, va_UV.y, 0.f, 1.f);
}