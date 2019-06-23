import ModelPlayer from './ModelPlayer'

import NeckRenderer  from './components/NeckRenderer'
import PonySnout     from './components/PonySnout'
import PonyTail      from './components/PonyTail'
import TorsoRenderer from './components/TorsoRenderer'

import { HEAD_CENTRE_X, HEAD_CENTRE_Y, HEAD_CENTRE_Z } from './constants'
import { HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z             } from './constants'
import { BODY_RP_Y_NOTSNEAK, BODY_RP_Z_NOTSNEAK      } from './constants'

export default class ModelEarthpony extends ModelPlayer {
  constructor (material, skin) {
    super(material, skin);

    this.addSub('neck', NeckRenderer);
    this.addSub('torso', TorsoRenderer);

    let head     = this.getSub('head'),
        body     = this.getSub('body'),
        leftArm  = this.getSub('leftArm'),
        rightArm = this.getSub('rightArm'),
        leftLeg  = this.getSub('leftLeg'),
        rightLeg = this.getSub('rightLeg');

    head
      .offset(HEAD_CENTRE_X, HEAD_CENTRE_Y, HEAD_CENTRE_Z)
      .around(HEAD_RP_X, HEAD_RP_Y, HEAD_RP_Z)

      .tex(12,16).box('rightEar',  -4,-6,1, 2,2,2)
          .flip().box('leftEar',    2,-6,1, 2,2,2);

    head.getNamed('base').setOffset(-4,-4,-4).resetVertices();
    head.getNamed('wear').setOffset(-4,-4,-4).resetVertices();

    body.around(HEAD_RP_X, BODY_RP_Y_NOTSNEAK, BODY_RP_Z_NOTSNEAK);

    body.getNamed('base').setSize(8,8,4).setOffset(-4,4,-2).resetVertices();
    body.getNamed('wear').setSize(8,8,4).setOffset(-4,4,-2).resetVertices();

    leftArm .around( 1,14,1);
    rightArm.around(-1,14,1);

    leftLeg .around( 2,12,10);
    rightLeg.around(-2,12,10);

    this.snout = head.addSub('snout', PonySnout);
    this.tail  = this.addSub('tail',  PonyTail);
  }
}
