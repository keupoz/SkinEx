import { Object3D } from 'three/src/core/Object3D'

import Material from './Material'

export default class ModelManager extends Object3D {
  constructor (skin) {
    super();

    this.skin = skin;
    this.material = new Material(skin.canvas);

    this.models     = {};
    this.modelsList = [];

    this.current = null;
    this.handler = undefined;
  }

  update () {
    this.material.update();
    this.modelsList.forEach(model => model.remap());
  }

  initModel (Model) {
    if (Model in this.models) return this.models[Model];

    let model = new Model(this.material, this.skin);

    this.modelsList.push(model);
    this.models[Model] = model;

    return model;
  }

  setModel (model) {
    this.remove(...this.children);
    this.current = model;
    this.add(model);

    this.render(true);
  }

  render (a) {
    if (typeof a == 'function') this.handler = a;
    else if (this.handler) this.handler(a);
  }
}
