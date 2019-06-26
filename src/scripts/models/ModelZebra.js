import ModelEarthpony from './ModelEarthpony'

export default class ModelZebra extends ModelEarthpony {
  initHead () {
    super.initHead();

    let bristles = this.sub('bristles');

    bristles.tex(56,32)
      .offset(-1,-1,-3)
      .box('bristle1', 0,-10,2, 2,6,2)
      .box('bristle2', 0,-10,4, 2,8,2)
      .box('bristle3', 0,-8, 6, 2,6,2)
      .rotate(0.3,0,0);

    bristles.sub('sub')
      .offset(-1.01,2,-7)
      .box('subchild1', 0,-10,4, 2,8,2)
      .box('subchild2', 0,-8, 6, 2,6,2)
      .rotate(-1,0,0);
  }
}
