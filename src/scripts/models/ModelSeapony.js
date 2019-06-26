import ModelUnicorn from './ModelUnicorn'

// import PlaneRenderer from './renderers/PlaneRenderer'

// import SeaponyTail from './components/SeaponyTail'

// import { FIN_ROT_Y } from './constants'


export default class ModelSeapony extends ModelUnicorn {
  // No support sorry
  /* initHooves () {
    super.initHooves();

    this.getSub('leftArm') .rotate(-0.5, 0.5,0);
    this.getSub('rightArm').rotate(-0.5,-0.5,0);

    this.remove(this.getSub('leftLeg'));
    this.remove(this.getSub('rightLeg'));

    this.addSub('centerFin', PlaneRenderer)
      .around(0,6,9)
      .tex(58,28).east(0,-6,0, 12,6)
      .rotate(Math.PI / 2 - 0.1, 0, 0);

    this.addSub('leftFin', PlaneRenderer)
      .around(3,-6,3)
      .flipZ().tex(56,16).east(0,0,0, 12,8)
      .rotate(0, -FIN_ROT_Y, 0);

    this.addSub('rightFin', PlaneRenderer)
      .around(-3,-6,3)
      .flipZ().tex(56,16).east(0,0,0, 12,8)
      .rotate(0, FIN_ROT_Y, 0);
  }

  initTail () {
    this.addSub('tail', SeaponyTail);
  } */
}
