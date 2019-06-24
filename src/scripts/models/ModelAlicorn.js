import ModelPegasus from './ModelPegasus'
import ModelUnicorn from './ModelUnicorn'

export default class ModelAlicorn extends ModelUnicorn {
  init () {
    super.init();

    this.initWings   = ModelPegasus.prototype.initWings;
    this.foldWings   = ModelPegasus.prototype.foldWings;
    this.unfoldWings = ModelPegasus.prototype.unfoldWings;

    this.initWings();
  }
}
