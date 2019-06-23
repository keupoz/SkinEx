import ModelEarthpony from './ModelEarthpony'

import ModelWings from './components/ModelWings'

export default class ModelPegasus extends ModelEarthpony {
  constructor (material, skin) {
    super(material, skin);

    this.addSub('wings', ModelWings);
  }
}
