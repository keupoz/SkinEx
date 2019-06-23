import BoxRenderer from './renderers/BoxRenderer'

export default class ModelPlayer extends BoxRenderer {
  constructor (material, skin) {
    super(material, skin);

    this.sub('head')
      .tex( 0,0).box('base', -4,-8,-4, 8,8,8)
      .tex(32,0).box('wear', -4,-8,-4, 8,8,8, 0.5);

    this.sub('body')
      .tex(16,16).box('base', -4,0,-2, 8,12,4)
      .tex(16,32).box('wear', -4,0,-2, 8,12,4, 0.25);

    this.slim(true).sub('slimLeftArm')
      .around(5,2.5,0)
      .tex(32,48).box('base', -1,-2,-2, 3,12,4)
      .tex(48,48).box('wear', -1,-2,-2, 3,12,4, 0.25);

    this.slim(true).sub('slimRightArm')
      .around(-5,2.5,0)
      .tex(40,16).box('base', -2,-2,-2, 3,12,4)
      .tex(40,32).box('wear', -2,-2,-2, 3,12,4, 0.25);

    this.unslim(true).sub('leftArm')
      .around(5,2,0)
      .tex(32,48).box('base', -1,-2,-2, 4,12,4)
      .tex(48,48).box('wear', -1,-2,-2, 4,12,4, 0.25);

    this.unslim(true).sub('rightArm')
      .around(-5,2,0)
      .tex(40,16).box('base', -3,-2,-2, 4,12,4)
      .tex(40,32).box('wear', -3,-2,-2, 4,12,4, 0.25);

    this.sub('leftLeg')
      .around(1.9,12,0)
      .tex(16,48).box('base', -2,0,-2, 4,12,4)
      .tex(0,48).box('wear', -2,0,-2, 4,12,4, 0.25);

    this.sub('rightLeg')
      .around(-1.9,12,0)
      .tex(0,16).box('base', -2,0,-2, 4,12,4)
      .tex(0,32).box('wear', -2,0,-2, 4,12,4, 0.25);
  }
}
