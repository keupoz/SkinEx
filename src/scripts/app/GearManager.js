import Material from './Material'

import { loadImage } from '../utils'

export default class GearManager {
  constructor (model) {
    this.model = model;
    this.materials = {};
  }

  async loadTexture (name, url) {
    let { err, img } = await loadImage(url);

    if (err) throw new Error(err);

    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width  = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0,0);

    this.materials[name] = new Material(canvas);
  }

  getMaterial (name) {
    return this.materials[name];
  }

  updateModel () {

  }
}
