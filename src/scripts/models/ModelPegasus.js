import ModelEarthpony from './ModelEarthpony'

import WingRenderer from './components/WingRenderer'

export default class ModelPegasus extends ModelEarthpony {
  init () {
    super.init();
    this.initWings();
  }

  initWings () {
    this.addSub('leftWing',  WingRenderer, false, 32);
    this.addSub('rightWing', WingRenderer, true,  16);

    this.foldWings();
  }

  foldWings () {
    this.getSub('leftWing') .fold();
    this.getSub('rightWing').fold();
  }

  unfoldWings () {
    this.getSub('leftWing') .unfold();
    this.getSub('rightWing').unfold();
  }
}
