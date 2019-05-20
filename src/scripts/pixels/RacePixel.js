import CommonPixel from './CommonPixel'

export default class RacePixel extends CommonPixel {
  constructor (name, x,y, model) {
    super(name, x,y, model);

    this.isPony    = false;
    this.isSeapony = false;
    this.hasHorn   = false;
    this.hasWings  = false;
  }

  get shouldPixelsRender () {
    return this.isPony;
  }

  set (value) {
    this.current = value;
    this.updateMask();
    return this.updateModel();
  }

  updateMask () {
    let mask = this.current.extra.mask;

    this.isPony    = !!(mask & 0b1000);
    this.isSeapony = !!(mask & 0b0100);
    this.hasHorn   = !!(mask & 0b0010);
    this.hasWings  = !!(mask & 0b0001);

    return this;
  }

  add (name, color, mask, model) {
    if (model) model = this.model.initModel(model);
    return super.add(name, color, { mask, model });
  }
}
