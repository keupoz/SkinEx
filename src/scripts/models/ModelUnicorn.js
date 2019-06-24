import ModelEarthpony from './ModelEarthpony'

import UnicornHorn from './components/UnicornHorn'

export default class ModelUnicorn extends ModelEarthpony {
  init () {
    super.init();

    this.horn = this.addSub('horn', UnicornHorn);
  }
}
