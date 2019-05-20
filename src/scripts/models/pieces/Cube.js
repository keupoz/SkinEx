import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'

import Mixin from './Mixin.js'

export default class Cube extends Mixin {
  constructor (material, textureX,textureY, width,height,depth, offsetX,offsetY,offsetZ, mcscale = 0, mirror) {
    super(new BoxGeometry(width, height, depth), material);

    this.textureX = textureX;
    this.textureY = textureY;

    this.width  = width;
    this.height = height;
    this.depth  = depth;

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.offsetZ = offsetZ;

    this.mcscale = mcscale;

    this.mirror = mirror;

    this.generateUVs();
    this.resetVertices();
  }

  resetVertices () {
    let { width, height, depth, mcscale, offsetX, offsetY, offsetZ } = this,
        { vertices } = this.geometry,

        x1 =   width + mcscale + offsetX,
        x2 =          -mcscale + offsetX,

        y1 = -height - mcscale - offsetY,
        y2 =           mcscale - offsetY,

        z1 =  -depth - mcscale - offsetZ,
        z2 =           mcscale - offsetZ;

    vertices[0].set(x1, y2, z2);
    vertices[1].set(x1, y2, z1);
    vertices[2].set(x1, y1, z2);
    vertices[3].set(x1, y1, z1);
    vertices[4].set(x2, y2, z1);
    vertices[5].set(x2, y2, z2);
    vertices[6].set(x2, y1, z1);
    vertices[7].set(x2, y1, z2);
  }

  setMirror (mirror) {
    this.mirror = mirror;
    return this;
  }

  setTextureOffset (x,y) {
    this.textureX = x;
    this.textureY = y;
    return this;
  }

  generateUVs () {
    let { width, height, depth, textureX, textureY, mirror } = this,
        left  = [ width + depth + textureX, textureY + depth, depth, height, 0, mirror ],
        right = [                 textureX, textureY + depth, depth, height, 0, mirror ];

    if (mirror) [ left, right ] = [ right, left ];

    return this.setUVs([
      left, right,
      [ textureX + depth,         textureY, width, depth,  0, mirror ], [ textureX + width +     depth,         textureY, width, depth,  2, !mirror ],
      [ textureX + depth, depth + textureY, width, height, 0, mirror ], [ textureX + width + 2 * depth, depth + textureY, width, height, 0,  mirror ]
    ]);
  }
}
