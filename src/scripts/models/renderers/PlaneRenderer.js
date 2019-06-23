import AbstractRenderer from './AbstractRenderer'
import Plane from '../primitives/Plane'
import Planes from '../primitives/Planes'

export default class PlaneRenderer extends AbstractRenderer {
  constructor (material, skin) {
    super(material, skin);

    this.mirrory = false;
    this.mirrorz = false;

    this.model.intersectable = true;
  }

  flipY () {
    this.mirrory = !this.mirrory;

    return this;
  }

  flipZ () {
    this.mirrorz = !this.mirrorz;

    return this;
  }

  addPlane (name, offX, offY, offZ, width, height, depth, scale = 0, face) {
    let plane = new Plane(this.material, this.textureOffsetX, this.textureOffsetY, offX, offY, offZ, width, height, depth, scale, face, this.$mirror, this.mirrory, this.mirrorz);

    return this.addChild(name, plane);
  }

  sub (name) {
    return this.addSub(name, PlaneRenderer);
  }

  top (offX, offY, offZ, width, depth, scale) {
    let name = 'top' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, width, 0, depth, scale, Planes.UP);
  }

  bottom (offX, offY, offZ, width, depth, scale) {
    let name = 'bottom' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, width, 0, depth, scale, Planes.DOWN);
  }

  west (offX, offY, offZ, height, depth, scale) {
    let name = 'west' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, 0, height, depth, scale, Planes.WEST);
  }

  east (offX, offY, offZ, height, depth, scale) {
    let name = 'east' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, 0, height, depth, scale, Planes.EAST);
  }

  north (offX, offY, offZ, width, height, scale) {
    let name = 'north' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, width, height, 0, scale, Planes.NORTH);
  }

  south (offX, offY, offZ, width, height, scale) {
    let name = 'south' + this.model.children.length;
    return this.addPlane(name, offX, offY, offZ, width, height, 0, scale, Planes.SOUTH);
  }
}
