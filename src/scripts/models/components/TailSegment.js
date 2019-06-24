import PlaneRenderer from '../renderers/PlaneRenderer'

import { TAIL_RP_X, TAIL_RP_Y, TAIL_RP_Z_NOTSNEAK } from '../constants'

export default class TailSegment extends PlaneRenderer {
  init (index) {
    super.init();

    let texY = (index % 2) * 4,
        y = index * 4;

    this.around(TAIL_RP_X, TAIL_RP_Y + 1, TAIL_RP_Z_NOTSNEAK);

    if (index == 0) this.tex(32,0).top(-2,0,2, 4,4);

    this.tex(36,texY) .east( 2,    y,2, 4,4)
                      .west(-2,    y,2, 4,4)
        .tex(32,texY).south(-2,    y,2, 4,4)
                     .north(-2,    y,6, 4,4)
        .tex(32,0)  .bottom(-2,4 + y,2, 4,4);
  }
}
