import Cube from './Cube.js'
import ModelGroup from './ModelGroup.js'

const RAD_90 = Math.PI / 2;

export default class BatClosedWings extends ModelGroup {
  constructor (material) {
    super();

    this.left  = new ModelGroup();
    this.right = new ModelGroup();

    this.left.add(
      new Cube(material, 56,16, 1,4,1, 8,0,0),
      new Cube(material, 56,16, 1,7,1, 8,0,2),
      new Cube(material, 56,16, 1,6,1, 8,0,4),
      new Cube(material, 56,16, 1,7,1, 8,0,8)
    );

    /* this.right.add(
      new Cube(this.material, 56,16, 2,6,2, -2,0,0),
      new Cube(this.material, 56,16, 2,8,2, -2,0,2),
      new Cube(this.material, 56,16, 2,6,2, -2,0,4)
    ); */

    this.setRotation(RAD_90,0,0);
    this.add(this.left, this.right);
  }
}
