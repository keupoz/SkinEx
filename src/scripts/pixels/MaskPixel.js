import Color from '../Color'

import AbstractPixel from './AbstractPixel'

export default class MaskPixel extends AbstractPixel {
  constructor (name, x,y, model) {
    super('MASK', name, x,y, model);

    this.color = new Color();
    this.selected = new Array();

    this.list   = new Array();
    this.names  = new Object();
    this.values = new Object();
  }

  getColor () {
    let colors = this.selected.map(item => this.get(item).value);
    this.color.setRGB(...colors);
    return this.color.num;
  }

  add (name, value) {
    let label = name.toNormalCase(),
        val = { name, label, value };

    this.names[name] = this.values[value] = val;
    this.list.push(val);

    return this;
  }

  get (name) {
    return this.names[name];
  }

  getByValue (value) {
    return this.values[value];
  }

  select (name) {
    if (this.selected.length >= 3) throw new RangeError('MaskPixel: Maximum count exceeded');
    if (!this.get(name)) throw new Error('MaskPixel: Unknown item (' + name + ')');

    this.selected.push(name);

    return this;
  }

  unselect (name) {
    let i = this.selected.indexOf(name);
    if (i !== -1) this.selected.splice(i, 1);

    return this;
  }

  setByColor (color) {
    this.color.setNUM(color).RGB.forEach(ch => {
      let item = this.getByValue(ch);
      if (item) this.selected.push(item.name);
    });

    return this;
  }
}
