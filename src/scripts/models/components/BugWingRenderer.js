import WingRenderer from './WingRenderer'

import PlaneRenderer from '../renderers/PlaneRenderer'

import { EXT_WING_RP_X, EXT_WING_RP_Y, EXT_WING_RP_Z, WING_ROT_Z_SNEAK } from '../constants'


export default class BugWingRenderer extends WingRenderer {
  addClosedWing () {}

  addFeathers (right) {
    this.right = right;

    let extended = this.getSub('extended'),
        r = right ? -1 : 1;

    extended
      .around(r * (EXT_WING_RP_X - 2), EXT_WING_RP_Y, EXT_WING_RP_Z - 2)
      .rotate(0, r * 3, 0);

    extended.addSub('primary', PlaneRenderer)
      .flipY(right)
      .tex(56,16).west(r * -0.5, 0, -7, 16,8);

    extended.addSub('secondary', PlaneRenderer)
      .flipY(right)
      .tex(56,32).west(r, 0, -5, 16,8)
      .rotate(-0.5, r * 0.3, r / 3);
  }

  fold () {
    let r = this.right ? -1 : 1;
    this.getSub('extended').rotate(0, r * 3, r * WING_ROT_Z_SNEAK);
  }

  unfold () {
    let r = this.right ? -1 : 1;
    this.getSub('extended').rotate(0, r * 3, -r * WING_ROT_Z_SNEAK);
  }
}
