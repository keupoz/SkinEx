import ModelUnicorn from './ModelUnicorn'

import ModelPegasus from './ModelPegasus';

export default class ModelAlicorn extends ModelUnicorn {
  init () {
    super.init();

    this.initWings   = ModelPegasus.prototype.initWings;
    this.foldWings   = ModelPegasus.prototype.foldWings;
    this.unfoldWings = ModelPegasus.prototype.unfoldWings;

    this.initWings();
  }
}
