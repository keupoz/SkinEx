import ModelUnicorn from './ModelUnicorn'

import ModelWings  from './components/ModelWings'

export default class ModelAlicorn extends ModelUnicorn {
  constructor (material, skin) {
    super(material, skin);

    this.wings = this.addSub('wings', ModelWings);
  }
}
