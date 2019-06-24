import ModelEarthpony from './ModelEarthpony'

import ModelWings   from './components/ModelWings'
import WingRenderer from './components/WingRenderer'

export default class ModelPegasus extends ModelEarthpony {
  init () {
    super.init();

    this.addSub('wings', ModelWings, WingRenderer);
  }
}
