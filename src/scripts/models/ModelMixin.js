import { Object3D } from 'three/src/core/Object3D.js'

export default class ModelMixin extends Object3D {
  constructor (material, skin) {
    super();

    this.material = material;
    this.skin     = skin;

    this.toRemap = new Array();
  }

  remap () {
    this.toRemap.forEach(child => child.generateUVs());
  }
}
