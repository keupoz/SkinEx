import Cube from './Cube.js'
import ModelGroup from './ModelGroup.js'

const RAD_90 = Math.PI / 2;

class FoldedWings extends ModelGroup {
  constructor (material) {
    super();

    this.material = material;

    this.left  = new ModelGroup();
    this.right = new ModelGroup();

    this.left.add(
      new Cube(this.material, 56,32, 2,6,2, 8,0,0),
      new Cube(this.material, 56,32, 2,8,2, 8,0,2),
      new Cube(this.material, 56,32, 2,6,2, 8,0,4)
    );

    this.right.add(
      new Cube(this.material, 56,16, 2,6,2, -2,0,0),
      new Cube(this.material, 56,16, 2,8,2, -2,0,2),
      new Cube(this.material, 56,16, 2,6,2, -2,0,4)
    );

    this.setRotation(RAD_90,0,0);
    this.add(this.left, this.right);
  }
}

class OpenedWing extends ModelGroup {
  constructor (material, textureY) {
    super(false);

    this.material = material;

    this.add(
      new Cube(this.material, 56,textureY, 1,8,2, -0.5,   6,   0,  0.1),
      new Cube(this.material, 56,textureY, 1,8,2, -0.5,-1.2,-0.2, -0.2).setRotation(-0.85,0,0),
      new Cube(this.material, 56,textureY, 1,8,2, -0.5, 1.8, 1.3, -0.1).setRotation(-0.75,0,0),
      new Cube(this.material, 56,textureY, 1,8,2, -0.5,   5,   2      ).setRotation( -0.5,0,0),
      new Cube(this.material, 56,textureY, 1,6,2, -0.5,   0,-0.2,  0.3),
      new Cube(this.material, 56,textureY, 1,3,2, -0.5,   0, 0.2, 0.19).setRotation(-0.85,0,0)
    ).children.forEach(cube => cube.rotation.x += 2.5);
  }
}

class OpenedWings extends ModelGroup {
  constructor (material) {
    super(false);

    this.material = material;

    this.left  = new OpenedWing(this.material, 35);
    this.right = new OpenedWing(this.material, 19);

    this.add(this.left, this.right);
  }
}

export default class Wings extends ModelGroup {
  constructor (material) {
    super(false);

    this.material = material;

    this.folded = new FoldedWings(this.material);
    //this.opened = new OpenedWings(this.material);

    this.add(this.folded);
  }
}
