import PlaneRenderer from '../renderers/PlaneRenderer'

import { HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z             } from '../constants'
import { HEAD_CENTRE_X, HEAD_CENTRE_Y, HEAD_CENTRE_Z } from '../constants'

export default class PonySnout extends PlaneRenderer {
  constructor (material, skin) {
    super(material, skin);

    this.sub('mare')
      .around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)
      .offset(HEAD_CENTRE_X, HEAD_CENTRE_Y, HEAD_CENTRE_Z + 0.25)

      .tex(10,14).south(-2,2,-5, 4,2)
      .tex(11,13).south(-1,1,-5, 2,1)
      .tex( 9,14)  .top(-2,2,-5, 1,1)
      .tex(14,14)  .top( 1,2,-5, 1,1)
      .tex(11,12)  .top(-1,1,-5, 2,1)
      .tex(18,7).bottom(-2,4,-5, 4,1)
      .tex( 9,14) .west(-2,2,-5, 2,1)
      .tex(14,14) .east( 2,2,-5, 2,1)
      .tex(11,12) .west(-1,1,-5, 1,1)
      .tex(12,12) .east( 1,1,-5, 1,1);

    this.sub('stallion')
      .around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)
      .offset(HEAD_CENTRE_X, HEAD_CENTRE_Y, HEAD_CENTRE_Z)

      .tex(10,13).south(-2,1,-5, 4,3)
      .tex(10,13)  .top(-2,1,-5, 4,1)
      .tex(18,7).bottom(-2,4,-5, 4,1)
      .tex(10,13) .west(-2,1,-5, 3,1)
      .tex(13,13) .east( 2,1,-5, 3,1);
  }

  setGender (gender) {
    this.remove.apply(this, this.children);

    if (gender == 'MALE') this.add(this.getSub('stallion'));
    else if (gender == 'FEMALE') this.add(this.getSub('mare'));
  }
}
