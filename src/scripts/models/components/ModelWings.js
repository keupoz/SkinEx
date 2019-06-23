import AbstractRenderer from '../renderers/AbstractRenderer'

import WingRenderer from './WingRenderer'

export default class ModelWings extends AbstractRenderer {
  constructor (material, skin) {
    super(material, skin);

    this.addSub('leftWing',  WingRenderer).init(false, 32);
    this.addSub('rightWing', WingRenderer).init(true,  16);

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
