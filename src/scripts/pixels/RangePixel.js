import CommonPixel from './CommonPixel'

export default class RangePixel extends CommonPixel {
  constructor (name, x,y, model) {
    super(name, x,y, model);
    this.type = 'RANGE';
  }

  add (name, color) {
    return super.add(name, color, this.list.length);
  }

  set (value) {
    return super.set(typeof value == 'number' ? this.list[value] : value);
  }
}
