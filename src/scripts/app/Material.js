import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial'
import { Texture } from 'three/src/textures/Texture'
import { DoubleSide, UVMapping, RepeatWrapping, NearestFilter } from 'three/src/constants'

export default class Material extends MeshLambertMaterial {
  constructor (canvas) {
    super({
      alphaTest: 0.5,
      flatShading: true,
      premultipliedAlpha: true,
      side: DoubleSide,
      transparent: true,

      map: new Texture(
        canvas,
        UVMapping,
        RepeatWrapping,
        RepeatWrapping,
        NearestFilter,
        NearestFilter
      )
    });

    this.map.premultiplyAlpha = true;

    this.canvas = canvas;

    this.setUVSize(64,64);
  }

  update () {
    this.map.needsUpdate = true;
  }

  setUVSize (width, height) {
    this.UVWidth  = width;
    this.UVHeight = height;
  }
}
