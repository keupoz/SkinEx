import ModelMixin  from './ModelMixin.js'

import Cube from './pieces/Cube.js'
import HornGlowPiece from './pieces/HornGlow.js'
import ModelGroup from './pieces/ModelGroup.js'

import { MareSnout, StallionSnout } from './pieces/Snouts.js'
import { Neck, Stomach, Butt, Stub, Wings, TailPiece } from './pieces/Body.js'
// import BatClosedWings from './pieces/BatWings.js'
import PegasusClosedWings from './pieces/PegasusWings.js'

export default class Pony extends ModelMixin {
  constructor (material, skin) {
    super(material, skin);

    this.head     = new Cube(material,  0,0, 8,8,8, -4,-4,-4).setRotationPoint(0,0,-2);
    this.headwear = new Cube(material, 32,0, 8,8,8, -4,-4,-4, 0.5);

    this.horn     = new Cube(material,  0, 3, 1,4,1, -0.5,-10,-1.5).setRotationPoint(0,1,0).setRotation(0.5,0,0);
    this.leftEar  = new Cube(material, 12,16, 2,2,2,  2,   -6, 1,  0,true);
    this.rightEar = new Cube(material, 12,16, 2,2,2, -4,   -6, 1);

    this.batEars = new ModelGroup(false).add(
      // Right
      new Cube(material, 0,3, 1,1,1, -3.5,-6.49,1.001),
      new Cube(material, 0,5, 1,1,1, -2.998,-6.49,2.001),

      // Left
      new Cube(material, 0,3, 1,1,1, 2.5,-6.49,1.001, 0,true),
      new Cube(material, 0,5, 1,1,1, 1.998,-6.49,2.001, 0,true)
    );

    this.hornGlow = new ModelGroup().add(
      new HornGlowPiece(-0.5,-10,-1.5, 4, 0.5, 0.4),
      new HornGlowPiece(-0.5,-10,-1.5, 3, 0.8, 0.2)
    ).setRotationPoint(0,1,0).setRotation(0.5,0,0);

    this.snout         = new ModelGroup().setRotationPoint(-2,1,-5);
    this.mareSnout     = new MareSnout(material);
    this.stallionSnout = new StallionSnout(material);

    this.neck = new Neck(material).setRotation(0.166,0,0);

    this.body     = new Cube(material, 16,16, 8,8,4, -4,4,-2);
    this.bodywear = new Cube(material, 16,32, 8,8,4, -4,4,-2, 0.25);
    this.stomach  = new Stomach(material).setRotationPoint(-4,4,2);
    this.butt     = new Butt(material).setRotationPoint(-4,4,10);
    this.stub     = new Stub(material).setRotation(0.5,0,0);
    this.wings    = new PegasusClosedWings(material).setRotationPoint(-4,11,2);
    // this.wings    = new BatClosedWings(material).setRotationPoint(-4,11,2);

    this.bodyGroup = new ModelGroup(false).setRotationPoint(0,1,0);

    this.tail = new ModelGroup(false).add(
      new TailPiece(material, 0),
      new TailPiece(material, 1),
      new TailPiece(material, 2),
      new TailPiece(material, 3)
    ).setRotationPoint(0,0,14);

    this.legs = new ModelGroup(false);

    this.leftFrontLeg  = new Cube(material, 32,48, 4,12,4, 0,0,0).setRotationPoint( 0,13,-1);
    this.rightFrontLeg = new Cube(material, 40,16, 4,12,4, 0,0,0).setRotationPoint(-4,13,-1);
    this.leftBackLeg   = new Cube(material, 16,48, 4,12,4, 0,0,0).setRotationPoint( 0,13, 8);
    this.rightBackLeg  = new Cube(material,  0,16, 4,12,4, 0,0,0).setRotationPoint(-4,13, 8);

    this.leftFrontLegWear  = new Cube(material, 48,48, 4,12,4, 0,0,0, 0.25);
    this.rightFrontLegWear = new Cube(material, 40,32, 4,12,4, 0,0,0, 0.25);
    this.leftBackLegWear   = new Cube(material,  0,48, 4,12,4, 0,0,0, 0.25);
    this.rightBackLegWear  = new Cube(material,  0,32, 4,12,4, 0,0,0, 0.25);

    this.head.add(this.headwear, this.hornGlow, this.horn, this.leftEar, this.rightEar, this.snout);
    this.bodyGroup.add(this.neck, this.body, this.stomach, this.butt, this.stub, this.wings, this.tail);
    this.legs.add(this.leftFrontLeg, this.rightFrontLeg, this.leftBackLeg, this.rightBackLeg);

    this.add(this.head, this.bodyGroup, this.legs);

    this.tailBak = this.tail.children.slice();

    this.toRemap.push(
      //...this.wings.folded.right.children,
      ...this.wings.right.children,
      ...this.tail.children,
      this.mareSnout, this.stallionSnout,
      this.head, this.headwear, this.horn,
      this.leftEar, this.rightEar, ...this.batEars.children,
      this.neck, this.body, this.stomach, this.butt, this.stub,
      this.rightFrontLeg, this.rightBackLeg
    );
  }

  remap () {
    super.remap();

    if (this.skin.isExtended) {
      this.body.add(this.bodywear);
      this.rightFrontLeg.add(this.rightFrontLegWear);
      this.rightBackLeg.add(this.rightBackLegWear);

      this.leftFrontLeg.add(this.leftFrontLegWear).setTextureOffset(32,48).setMirror(false).generateUVs();
      this.leftBackLeg.add(this.leftBackLegWear).setTextureOffset(16,48).setMirror(false).generateUVs();

      this.wings.left.children.forEach(child => child.setTextureOffset(56,32).setMirror(false).generateUVs());
      //this.wings.folded.left.children.forEach(child => child.setTextureOffset(56,32).setMirror(false).generateUVs());
      //this.wings.opened.left.children.forEach(child => child.setTextureOffset(56,35).setMirror(false).generateUVs());
    } else {
      this.body.remove(this.bodywear);
      this.rightFrontLeg.remove(this.rightFrontLegWear);
      this.rightBackLeg.remove(this.rightBackLegWear);

      this.leftFrontLeg.remove(this.leftFrontLegWear).setTextureOffset(40,16).setMirror(true).generateUVs();
      this.leftBackLeg.remove(this.leftBackLegWear).setTextureOffset(0,16).setMirror(true).generateUVs();

      this.wings.left.children.forEach(child => child.setTextureOffset(56,16).setMirror(true).generateUVs());
      //this.wings.folded.left.children.forEach(child => child.setTextureOffset(56,16).setMirror(true).generateUVs());
      //this.wings.opened.left.children.forEach(child => child.setTextureOffset(56,19).setMirror(true).generateUVs());
    }
  }

  update () {
    this.remap();
  }
}
