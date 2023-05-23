import { mat4, quat, vec3 } from 'gl-matrix'
import type { ReadonlyVec3 } from 'gl-matrix'

export default class OrbitControls {
  target = vec3.create()
  yaw = 0
  pitch = 0
  distance = 2

  viewTransform = mat4.create()
  rotation = quat.fromEuler(quat.create(), this.pitch, this.yaw, 0)
  eye = vec3.create()

  constructor() {
    this.computeViewTransform()
  }

  computeViewTransform() {
    // update rotation
    quat.fromEuler(this.rotation, this.pitch, this.yaw, 0)

    vec3.set(this.eye, 0, 0, this.distance)
    vec3.transformQuat(this.eye, this.eye, this.rotation)
    vec3.add(this.eye, this.eye, this.target)

    mat4.fromRotationTranslationScale(this.viewTransform, this.rotation, this.eye, [1, 1, 1])
    const lol = vec3.fromValues(0, 0, -1)
    vec3.transformQuat(lol, lol, this.rotation)
  }

  addPitch(rad: number) {
    this.pitch = Math.max(-90, Math.min(this.pitch + rad, 90))
  }

  addYaw(rad: number) {
    this.yaw = (this.yaw + rad + 360) % 360
  }

  addDistance(dist: number) {
    this.distance = Math.max(0.01, Math.min(this.distance + dist, 1000))
  }

  moveTargetLocal(dist: ReadonlyVec3) {
    const localDist = vec3.transformQuat(vec3.create(), dist, this.rotation)
    vec3.add(this.target, this.target, localDist)
  }
}
