import ModelMixin from './ModelMixin.js'

import Cube from './pieces/Cube.js'

export default class Human extends ModelMixin {
  constructor (material, skin) {
    super(material, skin);

    this.head     = new Cube(this.material,  0,0, 8,8,8, -4,-4,-4).setRotationPoint(0,0,-2);
    this.headwear = new Cube(this.material, 32,0, 8,8,8, -4,-4,-4, 0.5);

    this.body     = new Cube(this.material, 16,16, 8,12,4, -4,0,-2).setRotationPoint(0,4,-2);
    this.bodywear = new Cube(this.material, 16,32, 8,12,4, -4,0,-2, 0.25);

    this.leftArm  = new Cube(this.material, 32,48, 4,12,4, 0,0,0).setRotationPoint( 4, 4,-4);
    this.rightArm = new Cube(this.material, 40,16, 4,12,4, 0,0,0).setRotationPoint(-8, 4,-4);
    this.leftLeg  = new Cube(this.material, 16,48, 4,12,4, 0,0,0).setRotationPoint( 0,16,-4);
    this.rightLeg = new Cube(this.material,  0,16, 4,12,4, 0,0,0).setRotationPoint(-4,16,-4);

    this.leftArmWear  = new Cube(this.material, 48,48, 4,12,4, 0,0,0, 0.25);
    this.rightArmWear = new Cube(this.material, 40,32, 4,12,4, 0,0,0, 0.25);
    this.leftLegWear  = new Cube(this.material,  0,48, 4,12,4, 0,0,0, 0.25);
    this.rightLegWear = new Cube(this.material,  0,32, 4,12,4, 0,0,0, 0.25);

    this.head.add(this.headwear);
    this.add(this.head, this.body, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

    this.toRemap.push(
      this.head, this.headwear,
      this.body,
      this.rightArm, this.rightLeg,
    );
  }

  remap () {
    super.remap();

    if (this.skin.isExtended) {
      this.body.add(this.bodywear);
      this.rightArm.add(this.rightArmWear);
      this.rightLeg.add(this.rightLegWear);

      this.leftArm.add(this.leftArmWear).setTextureOffset(32,48).setMirror(false).generateUVs();
      this.leftLeg.add(this.leftLegWear).setTextureOffset(16,48).setMirror(false).generateUVs();

    } else {
      this.body.remove(this.bodywear);
      this.rightArm.remove(this.rightArmWear);
      this.rightLeg.remove(this.rightLegWear);

      this.leftArm.remove(this.leftArmWear).setTextureOffset(40,16).setMirror(true).generateUVs();
      this.leftLeg.remove(this.leftLegWear).setTextureOffset( 0,16).setMirror(true).generateUVs();
    }
  }
}
