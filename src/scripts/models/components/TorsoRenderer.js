import PlaneRenderer from '../renderers/PlaneRenderer'

import { HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z } from '../constants'
import { BODY_CENTRE_X, BODY_CENTRE_Y, BODY_CENTRE_Z } from '../constants'

export default class TorsoRenderer extends PlaneRenderer {
  init () {
    super.init();

    this
      .offset(BODY_CENTRE_X, BODY_CENTRE_Y, BODY_CENTRE_Z)
      .around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)

      .tex(24, 0)    .east( 4,-4,-4, 8,8)
      .tex(4,  0)    .east( 4,-4, 4, 8,4)
      .tex(56, 0)  .bottom(-4, 4,-4, 8,8)
      .tex(36, 16)  .north(-4,-4, 8, 8,4)
                    .north(-4, 0, 8, 8,4)
                   .bottom(-4, 4, 4, 8,4)
  .flipZ().tex(32, 20).top(-4,-4,-4, 8,12)
          .tex(24, 0).west(-4,-4,-4, 8,8)
          .tex(4, 0) .west(-4,-4, 4, 8,4)

      // Tail stub
      .sub('tail')
        .offset(BODY_CENTRE_X, BODY_CENTRE_Y, BODY_CENTRE_Z)
        .tex(32, 0).top(-1,2,2, 2,6)
                .bottom(-1,4,2, 2,6)
                  .east( 1,2,2, 2,6)
                 .south(-1,2,8, 2,2)
          .flipZ().west(-1,2,2, 2,6)
          .rotate(0.5, 0, 0);
  }
}
