import Cube from './Cube.js'
import ModelGroup from './ModelGroup.js'

const RAD_90 = Math.PI / 2;

export default class PegasusClosedWings extends ModelGroup {
  constructor (material) {
    super();

    this.left  = new ModelGroup();
    this.right = new ModelGroup();

    this.left.add(
      new Cube(material, 56,32, 2,6,2, 8,0,0),
      new Cube(material, 56,32, 2,8,2, 8,0,2),
      new Cube(material, 56,32, 2,6,2, 8,0,4)
    );

    this.right.add(
      new Cube(material, 56,16, 2,6,2, -2,0,0),
      new Cube(material, 56,16, 2,8,2, -2,0,2),
      new Cube(material, 56,16, 2,6,2, -2,0,4)
    );

    this.setRotation(RAD_90,0,0);
    this.add(this.left, this.right);
  }
}
