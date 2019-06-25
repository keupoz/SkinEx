import ModelPegasus from './ModelPegasus'
import ModelUnicorn from './ModelUnicorn'

import BugWingRenderer from './components/BugWingRenderer'


export default class ModelChangeling extends ModelUnicorn {
  init () {
    super.init();

    this.foldWings   = ModelPegasus.prototype.foldWings;
    this.unfoldWings = ModelPegasus.prototype.unfoldWings;

    this.initWings();
  }

  initWings () {
    this.addSub('leftWing',  BugWingRenderer, false, 16);
    this.addSub('rightWing', BugWingRenderer, true,  16);

    this.foldWings();
  }
}
