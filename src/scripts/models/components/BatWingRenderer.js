import WingRenderer from './WingRenderer'

import PlaneRenderer from '../renderers/PlaneRenderer'

import { HEAD_RP_X, WING_FOLDED_RP_Y, WING_FOLDED_RP_Z } from '../constants'
import { EXT_WING_RP_X, EXT_WING_RP_Y, EXT_WING_RP_Z   } from '../constants'
import { ROTATE_90 } from '../constants'


export default class BatWingRenderer extends WingRenderer {
  init (...args) {
    super.init.apply(this, args);

    this.scale.set(1.3,1.3,1.3);
  }

  addClosedWing (right) {
    let r = right ? -1 : 1,
        x = r * 3.5;

    this.getSub('folded')
      .around(HEAD_RP_X - 0.5, WING_FOLDED_RP_Y - 1, WING_FOLDED_RP_Z - 2)
      // .offset(r,0,0)
      .mirror(right)
      .tex(56, 16).box('feather1', 0.9 * x,5,4, 1,4,1)
                  .box('feather2',       x,5,6, 1,7,1)
                  .box('feather3',       x,5,5, 1,6,1)
                  .box('feather4', 0.9 * x,5,7, 1,7,1)
      .rotate(ROTATE_90,0,0);
  }

  addFeathers (right) {
    let extended = this.getSub('extended'),
        r = right ? -1 : 1;

    extended
      .around(r * (EXT_WING_RP_X - 2), EXT_WING_RP_Y - 1, EXT_WING_RP_Z - 3)
      .rotate(0, r * 3, -r * 2.5);

    extended
      .sub('child')
        .mirror(right)
        .tex(60, 16).box('child', -0.5,-1,0, 1,8,1, 0.001)
        .rotate(0.1,0,0)
        .sub('child1')
          .around(0, -1, -2)
          .mirror(right)
          .tex(60,16).box('child', -0.5,0,2, 1,7,1)
          .rotate(-0.5, 0, 0);

    extended
      .getSub('child')
        .sub('child2')
          .around(0,4,-2.4)
          .mirror(right)
          .tex(60,16).box('child', -0.5,0,3, 1,7,1)
          .rotate(-0.5,0,0);

    extended.getSub('child').addSub('skin', PlaneRenderer)
      .tex(56,32).west(0,0,-7, 16,8);
  }
}
