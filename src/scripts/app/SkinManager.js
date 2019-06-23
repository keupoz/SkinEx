export default class SkinManager {
  constructor () {
    this.canvas = document.createElement('canvas');
    this.ctx    = this.canvas.getContext('2d');

    this.imageData = null;
    this.scale = 0;
    this.isSlim = false;
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
    this.canvas.width = this.canvas.height = img.width;

    this.scale = img.width / 64;

    this.ctx.drawImage(img, 0,0);

    if (img.width !== img.height) this.convertToModern(img);

    this.imageData = this.ctx.getImageData(0,0, 4,2).data;
  }

  setSlim (isSlim) {
    this.isSlim = isSlim;
  }

  isVeryOld () {
    for (let x = 4 * this.scale; x < 8 * this.scale; x++)
      for (let y = 0; y < 8 * this.scale; y++)
        if (this.ctx.getImageData(x,y, 1,1).data.slice(0,3).join(',') !== '0,0,0') return false;

    return true;
  }

  clear (x,y, w,h) {
    let s = this.scale;
    this.ctx.clearRect(x * s, y * s, w * s, h * s);
  }

  draw (img, sx,sy, sw,sh, dx,dy, dw,dh) {
    let s = this.scale;

    this.ctx.drawImage(img, sx * s, sy * s, sw * s, sh * s, dx * s, dy * s, dw * s, dh * s)
  }

  translate (x,y) {
    this.ctx.translate(x * this.scale, y * this.scale);
  }

  convertVeryOld (img) {
    // Clear areas
    this.clear( 1,3,   2,1);  // horn top & bottom
    this.clear( 0,4,   4,4);  // horn other sides
    this.clear( 4,0,   4,8);  // cutiemark
    this.clear(56,0,   8,8);  // stomach
    this.clear( 0,16, 12,4);  // neck and hooves top & bottom
    this.clear( 0,20, 16,12); // hooves other sides
    this.clear(36,16,  8,4);  // butt
    this.clear(32,20,  8,12); // back

    // Horn
    this.draw(img, 57,0, 2,1, 1,3, 2,1); // top & bottom
    this.draw(img, 56,1, 4,4, 0,4, 4,4); // other sides

    // Cutiemark
    this.draw(img, 0,20, 4,8, 4,0, 4,8);

    // Neck
    this.draw(img, 24,0, 4,4, 0,16, 4,4);

    // Back hooves
    this.draw(img, 44,16,  8,4,  4,16,  8,4);  // top & bottom
    this.draw(img, 40,20, 16,12, 0,20, 16,12); // other sides

    // Stomach and butt
    this.ctx.save();
    this.translate(56,8);
    this.ctx.scale(1,-1);
    this.draw(img, 24,0, 8,8,   0,0,   8,8); // Stomach
    this.draw(img, 24,0, 8,4, -20,-12, 8,4); // Butt
    this.ctx.restore();

    // Back
    this.ctx.save();
    this.translate(40,32);
    this.ctx.rotate(Math.PI);
    this.draw(img, 24,0, 8,4, 0,0, 8,4);
    this.draw(img, 24,0, 8,8, 0,4, 8,8);
    this.ctx.restore();
  }

  convertToModern (img, mirror = true) {
    // Clear areas
    // Left back hoof
    this.clear(20,48,  8,4 ); // top & bottom
    this.clear(16,52, 16,12); // other sides

    // Left foreleg
    this.clear(36,48,  8,4 ); // top & bottom
    this.clear(32,52, 16,12); // outside

    // Left wing
    this.clear(58,32, 4,2 ); // top & bottom
    this.clear(56,34, 8,14); // others

    if (mirror) {
      this.ctx.save();
      this.ctx.scale(-1,1);
      // Left back hoof
      this.draw(img,  4,16, 4, 4, -20,48, -4, 4); // top
      this.draw(img,  8,16, 4, 4, -24,48, -4, 4); // bottom
      this.draw(img,  0,20, 4,12, -24,52, -4,12); // outside
      this.draw(img,  4,20, 4,12, -20,52, -4,12); // front
      this.draw(img,  8,20, 4,12, -16,52, -4,12); // inside
      this.draw(img, 12,20, 4,12, -28,52, -4,12); // back

      // Left front hoof
      this.draw(img, 44,16, 4, 4, -36,48, -4, 4); // top
      this.draw(img, 48,16, 4, 4, -40,48, -4, 4); // bottom
      this.draw(img, 40,20, 4,12, -40,52, -4,12); // outside
      this.draw(img, 44,20, 4,12, -36,52, -4,12); // front
      this.draw(img, 48,20, 4,12, -32,52, -4,12); // inside
      this.draw(img, 52,20, 4,12, -44,52, -4,12); // back

      // Left wing
      this.draw(img, 58,16, 2, 2, -58,32, -2, 2); // top
      this.draw(img, 60,16, 2, 2, -60,32, -2, 2); // bottom
      this.draw(img, 56,18, 2,14, -60,34, -2,14); // outside
      this.draw(img, 58,18, 2,14, -58,34, -2,14); // front
      this.draw(img, 60,18, 2,14, -56,34, -2,14); // inside
      this.draw(img, 62,18, 2,14, -62,34, -2,14); // back
      this.ctx.restore();
    } else {
      // Left back hoof
      this.draw(img,  4,16,  8, 4, 20,48,  8,4); // top & bottom
      this.draw(img,  0,20, 16,12, 16,52, 16,12); // other sides

      // Left front hoof
      this.draw(img, 44,16,  8, 4, 36,48,  8,4); // top & bottom
      this.draw(img, 40,20, 16,12, 32,52, 16,12); // outside

      // Left wing
      this.draw(img, 58,16, 4, 2, 58,32, 4,2 ); // top & bottom
      this.draw(img, 56,18, 8,14, 56,34, 8,14); // other sides
    }
  }
}
