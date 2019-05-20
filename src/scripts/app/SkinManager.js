export default class SkinManager {
  constructor () {
    this.canvas = document.createElement('canvas');
    this.ctx    = this.canvas.getContext('2d');

    this.imageData = null;
    this.scale = 0;
    this.isExtended = false;
  }

  getPixel (x,y) {
    let { imageData } = this,
        index = x * 4 + y * 16;

    return (imageData[index++] << 16 | imageData[index++] << 8 | imageData[index++]) >>> 0;
  }

  renderPixel (pixel) {
    let { x,y } = pixel,
        color = pixel.getColor();

    if (!color) return;

    this.ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    this.ctx.fillRect(x,y, 1,1);
  }

  setSkin (img) {
    this.canvas.width = img.width;
    this.canvas.height = img.height;

    this.scale = img.width / 64;
    this.isExtended = img.width == img.height;

    this.ctx.drawImage(img, 0,0);
    this.imageData = this.ctx.getImageData(0,0, 4,2).data;
  }
}
