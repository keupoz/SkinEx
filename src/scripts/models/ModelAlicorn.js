import ModelUnicorn from './ModelUnicorn'

import ModelWings   from './components/ModelWings'
import WingRenderer from './components/WingRenderer'

export default class ModelAlicorn extends ModelUnicorn {
  init () {
    super.init();

    this.wings = this.addSub('wings', ModelWings, WingRenderer);
  }
}
