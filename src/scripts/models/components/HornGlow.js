import { MeshBasicMaterial, BoxGeometry } from 'three'
import { SrcAlphaFactor, OneFactor, CustomBlending } from 'three'

import Mixin from '../primitives/Mixin'

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

export default class HornGlow extends Mixin {
  constructor (x,y,z, height, scale, opacity) {
    super(new BoxGeometry(1, height, 1), new GlowMaterial(opacity));

    let { vertices } = this.geometry;

    vertices[0].set(1 + x,                   scale - y,     -z);
    vertices[1].set(1 + x,                   scale - y, -1 - z);
    vertices[2].set(1 + x + scale, -height - scale - y,      scale - z);
    vertices[3].set(1 + x + scale, -height - scale - y, -1 - scale - z);
    vertices[4].set(    x,                   scale - y, -1 - z);
    vertices[5].set(    x,                   scale - y,     -z);
    vertices[6].set(    x - scale, -height - scale - y, -1 - scale - z);
    vertices[7].set(    x - scale, -height - scale - y,      scale - z);
  }

  setColor (color) {
    this.material.color.set(color);
  }
}
