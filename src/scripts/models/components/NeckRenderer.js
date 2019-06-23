import PlaneRenderer from '../renderers/PlaneRenderer'

import { NECK_CENTRE_X, NECK_CENTRE_Y, NECK_CENTRE_Z } from '../constants'
import { NECK_ROT_X } from '../constants'
import { HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z } from '../constants'

export default class NeckRenderer extends PlaneRenderer {
  constructor (material, skin) {
    super(material, skin);

    this.tex(0,16)
      .at(NECK_CENTRE_X, NECK_CENTRE_Y, NECK_CENTRE_Z)
      .offset(NECK_CENTRE_X, NECK_CENTRE_Y, NECK_CENTRE_Z)
      .rotate(NECK_ROT_X, 0, 0).around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)
      .north(0,0,0, 4,4)
      .south(0,0,4, 4,4)
       .east(4,0,0, 4,4)
       .west(0,0,0, 4,4);
  }
}
