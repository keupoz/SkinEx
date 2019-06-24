import BoxRenderer from '../renderers/BoxRenderer'

import { HEAD_RP_X, WING_FOLDED_RP_Y, WING_FOLDED_RP_Z } from '../constants'
import { EXT_WING_RP_X, EXT_WING_RP_Y, EXT_WING_RP_Z } from '../constants'
import { ROTATE_90 } from '../constants'

export default class WingRenderer extends BoxRenderer {
  init (right, texY) {
    super.init();

    this.sub('folded').tex(56, texY);
    this.sub('extended').tex(56 + (!right ? 1 : 0), texY + 3);

    this.addClosedWing(right);
    this.addFeathers(right);

    return this;
  }

  fold () {
    this.remove(this.getSub('extended')).add(this.getSub('folded'));
  }

  unfold () {
    this.remove(this.getSub('folded')).add(this.getSub('extended'));
  }

  addClosedWing (right) {
    let x = right ? -6 : 4;

    this.getSub('folded')
      .around(HEAD_RP_X, WING_FOLDED_RP_Y, WING_FOLDED_RP_Z)
      .box('feather0', x,5,2, 2,6,2)
      .box('feather1', x,5,4, 2,8,2)
      .box('feather2', x,5,6, 2,6,2)
      .rotate(ROTATE_90, 0,0);
  }

  addFeathers (right, l) {
    let r = right ? -1 : 1;

    this.getSub('extended')
      .around(r * EXT_WING_RP_X, EXT_WING_RP_Y, EXT_WING_RP_Z)
      .rotate(0, r * 3, -r * 2.5);

    this.addFeather(0,  6,   0,   9,  0.1);
    this.addFeather(1, -1,  -0.3, 8,  0.1) .rotate(-0.85,0,0);
    this.addFeather(2,  1.8, 1.3, 8, -0.1) .rotate(-0.75,0,0);
    this.addFeather(3,  5,   2,   8)       .rotate(-0.5, 0,0);
    this.addFeather(4,  0,  -0.2, 6,  0.3);
    this.addFeather(5,  0,   0,   3,  0.19).rotate(-0.85,0,0);
  }

  addFeather (i, y,z, h, scale) {
    return this.getSub('extended').sub('feather' + i).box('base', -0.5,y,z, 1,h,2, scale);
  }
}
