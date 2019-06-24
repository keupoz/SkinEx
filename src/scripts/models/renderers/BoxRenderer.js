import AbstractRenderer from './AbstractRenderer'

import Box from '../primitives/Box'

export default class BoxRenderer extends AbstractRenderer {
  addBox (name, offX, offY, offZ, width, height, depth, scaleFactor, mirror) {
    let box = new Box(this.material, this.textureOffsetX, this.textureOffsetY, width, height, depth, offX, offY, offZ, scaleFactor, mirror);

    return this.addChild(name, box);
  }

  box (name, offX, offY, offZ, width, height, depth, scaleFactor) {
    return this.addBox(name, offX, offY, offZ, width, height, depth, scaleFactor, this.$mirror);
  }

  sub (name) {
    return this.addSub(name, BoxRenderer);
  }
}
