export default class AbstractPixel {
  constructor (type, name, x,y, model) {
    this.type  = type;
    this.name  = name;
    this.label = name.toNormalCase();

    this.model = model;

    this.x = x;
    this.y = y;
  }

  getColor () {
    return 0x000000;
  }

  setByColor () {}
  set () {}

  updateModel (a) {
    if (typeof a == 'function') this.handler = a;
    else if (this.handler) {
      let shouldRender = this.handler(this.model.current, a) !== false;
      if (shouldRender) this.model.render();
    }
  }
}
