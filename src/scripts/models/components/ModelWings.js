import AbstractRenderer from '../renderers/AbstractRenderer'

export default class ModelWings extends AbstractRenderer {
  init (WingRenderer) {
    super.init();

    this.addSub('leftWing',  WingRenderer, false, 32);
    this.addSub('rightWing', WingRenderer, true,  16);

    this.fold();
  }

  fold () {
    this.getSub('leftWing') .fold();
    this.getSub('rightWing').fold();
  }

  unfold () {
    this.getSub('leftWing') .unfold();
    this.getSub('rightWing').unfold();
  }
}
