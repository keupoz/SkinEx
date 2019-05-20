import Cube from './Cube.js'
import ModelGroup from './ModelGroup.js'

const RAD_90 = Math.PI / 2;

export class AbstractClosedWing extends ModelGroup {
  constructor (material, topTex, right) {
    super();

    this.material = material;

    this.right = right;

    this.texY = topTex ? 16 : 32;
    this.offX = right  ? -2 : 8;
  }

  addCube (w,h,d, x,y) {
    this.add(new Cube(this.material, 56,this.texY, w,h,d, this.offX + x,0,y, 0, this.right));
    return this;
  }
}

export class AbstractClosedWings extends ModelGroup {
  constructor (leftWing, rightWing) {
    super();

    this.left  = leftWing;
    this.right = rightWing;

    this.setRotation(RAD_90,0,0);
    this.add(this.left, this.right);
  }
}
