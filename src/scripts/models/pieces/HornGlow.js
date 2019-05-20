import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js'
import { SrcAlphaFactor, OneFactor, CustomBlending } from 'three/src/constants.js'

import Mixin from './Mixin.js'

class GlowMaterial extends MeshBasicMaterial {
  constructor (opacity) {
    super({
      opacity,
      transparent:   true,
      blendSrc:      SrcAlphaFactor,
      blendSrcAlpha: SrcAlphaFactor,
      blendDst:      OneFactor,
      blendDstAlpha: OneFactor,
      blending:      CustomBlending
    });
  }
}

export default class HornGlowPiece extends Mixin {
  constructor (ox,oy,oz, height, mcscale, opacity) {
    super(new BoxGeometry(1, height, 1), new GlowMaterial(opacity));

    let { vertices } = this.geometry;

    vertices[0].set(1 + ox,                     mcscale - oy,     -oz);
    vertices[1].set(1 + ox,                     mcscale - oy, -1 - oz);
    vertices[2].set(1 + ox + mcscale, -height - mcscale - oy,      mcscale - oz);
    vertices[3].set(1 + ox + mcscale, -height - mcscale - oy, -1 - mcscale - oz);
    vertices[4].set(    ox,                     mcscale - oy, -1 - oz);
    vertices[5].set(    ox,                     mcscale - oy,     -oz);
    vertices[6].set(    ox - mcscale, -height - mcscale - oy, -1 - mcscale - oz);
    vertices[7].set(    ox - mcscale, -height - mcscale - oy,      mcscale - oz);
  }
}

