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

  updateModel (handler) {
    if (typeof handler == 'function') this.handler = handler;
    else if (this.handler) {
      let shouldRender = this.handler(this.model.current) !== false;
      if (shouldRender) this.model.render();
    }
  }
}
