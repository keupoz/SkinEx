export default class PixelManager {
  constructor (skin, model) {
    this.skin  = skin;
    this.model = model;

    this.pixels = {};
    this.pixelsList = [];

    this.controlPixel = null;
  }

  get shouldRender () {
    return this.controlPixel ? this.controlPixel.shouldPixelsRender : true;
  }

  registerPixel (PixelClass, x,y, name, control, extra) {
    let pixel = new PixelClass(name, x,y, this.model, extra);
    this.pixels[name.toLowerCase()] = pixel;
    this.pixelsList.push(pixel);

    if (control) this.controlPixel = pixel;

    return pixel;
  }

  render () {
    let { ctx, scale } = this.skin;

    ctx.clearRect(0,0, 4 * scale, 2 * scale);

    if (this.shouldRender) this.pixelsList.forEach(pixel => {
      this.skin.renderPixel(pixel);
    });
  }

  update () {
    this.pixelsList.forEach(pixel => {
      let { x,y } = pixel,
          color = this.skin.getPixel(x,y);

      pixel.setByColor(color);
    });
  }
}
