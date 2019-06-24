import BoxRenderer from '../renderers/BoxRenderer'
import HornGlow    from './HornGlow'

import { HORN_X, HORN_Y, HORN_Z          } from '../constants'
import { HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z } from '../constants'

export default class UnicornHorn extends BoxRenderer {
  init () {
    super.init();

    this
      .offset(HORN_X, HORN_Y, HORN_Z)
      .around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)
      .tex(0,3).box('base', 0,0,0, 1,4,1)
      .rotate(0.5,0,0)

      .addChild('glow1', new HornGlow(0,0,0, 4, 0.5, 0.4))
      .addChild('glow2', new HornGlow(0,0,0, 3, 0.8, 0.2));
  }

  setGlowColor (color) {
    this.getNamed('glow1').setColor(color);
    this.getNamed('glow2').setColor(color);
  }
}
