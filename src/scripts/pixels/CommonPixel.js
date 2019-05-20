import AbstractPixel from './AbstractPixel'

export default class CommonPixel extends AbstractPixel {
  constructor (name, x,y, model) {
    super('COMMON', name, x,y, model);

    this.list   = new Array();
    this.colors = new Object();

    this.current = null;
  }

  getColor () {
    return this.current.color;
  }

  add (name, color, extra) {
    let label = name.toNormalCase(),
        value = { name, label, color, extra };

    this.colors[color] = value;
    this.list.push(value);

    return this;
  }

  set (value) {
    this.current = value;
    return this.updateModel();
  }

  setByColor (color) {
    return this.set(this.getByColor(color));
  }

  getByColor (color) {
    return this.colors[color] || this.colors[0];
  }
}
