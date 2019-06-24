import ModelPegasus from './ModelPegasus'

import BatWingRenderer from './components/BatWingRenderer'

export default class ModelBatpony extends ModelPegasus {
  initWings () {
    this.addSub('leftWing',  BatWingRenderer, false, 16);
    this.addSub('rightWing', BatWingRenderer, true,  16);

    this.foldWings();
  }
}
