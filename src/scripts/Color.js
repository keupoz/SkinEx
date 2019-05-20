import COLORS from 'colorwheel2/src/csscolors.json'

const NAMES = {};

Object.keys(COLORS).forEach(name => {
  NAMES[COLORS[name]] = name;
});

export default class Color {
  constructor (color) {
    this.RGB = [ 0,0,0 ];
    this.setNUM(color);
  }

  isDark () {
    let { RGB } = this;
    return 0.299 * RGB[0] + 0.587 * RGB[1] + 0.114 * RGB[2] <= 127.5;
  }

  getName () {
    return NAMES[this.hex] || this.hex;
  }


  setRGB (r,g,b) {
    this.RGB[0] = r & 0xff;
    this.RGB[1] = g & 0xff;
    this.RGB[2] = b & 0xff;

    this.updateNUM();
    this.updateHEX();

    return this;
  }

  setHEX (hex) {
    hex = parseInt(hex.replace('#', ''), 16);

    if (isNaN(hex)) throw new TypeError('Color: invalid hex code');

    this.setNUM(hex);

    return this;
  }

  setName (name) {
    name = name.replace(/\s+/g, '').toLowerCase();
    if (name in COLORS) this.setHEX(COLORS[name]);
    else this.setHEX(name);

    return this;
  }

  setNUM (num) {
    this.num = num & 0xffffff;

    this.updateRGB();
    this.updateHEX();

    return this;
  }

  updateRGB () {
    let { RGB, num } = this;

    RGB[0] = num >> 16;
    RGB[1] = num >> 8 & 0xff;
    RGB[2] = num & 0xff;
  }

  updateNUM () {
    let [ r,g,b ] = this.RGB;

    this.num = (r << 16) + (g << 8) + b;
  }

  updateHEX () {
    this.hex = '#' + this.num.toString(16).padStart(6, '0');
  }
}
