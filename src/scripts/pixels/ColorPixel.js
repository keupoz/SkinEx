import Color from '../Color'

import AbstractPixel from './AbstractPixel'

export default class ColorPixel extends AbstractPixel {
  constructor (name, x,y, model, defaultColor) {
    super('COLOR', name, x,y, model);

    this.default = defaultColor;
    this.color = new Color(defaultColor);
  }

  getColor () {
    return this.color.num || this.default;
  }

  setByColor (color) {
    this.color.setNUM(color);
    return this.updateModel();
  }

  set (value) {
    return this.setByColor(value);
  }
}
