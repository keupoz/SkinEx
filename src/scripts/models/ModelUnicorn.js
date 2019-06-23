import ModelEarthpony from './ModelEarthpony'

import UnicornHorn from './components/UnicornHorn'

export default class ModelUnicorn extends ModelEarthpony {
  constructor (material, skin) {
    super(material, skin);

    this.horn = this.addSub('horn', UnicornHorn);
  }
}
