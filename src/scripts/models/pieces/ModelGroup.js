import { Group } from 'three/src/objects/Group.js'

import Mixin from './Mixin.js'

export default class ModelGroup extends Group {
  constructor (intersectable = true) {
    super();

    this.intersectable = intersectable;

    this.setRotationPoint = Mixin.prototype.setRotationPoint;
    this.setRotation = Mixin.prototype.setRotation;
  }
}
