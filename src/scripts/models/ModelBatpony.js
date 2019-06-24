import ModelPegasus from './ModelPegasus'

import BatWingRenderer from './components/BatWingRenderer'

export default class ModelBatpony extends ModelPegasus {
  initEars () {
    this.getSub('head')
      .tex(12,16).box('rightBase', -4,     -6,    1,     2,2,2)
        .tex(0,3).box('rightSub1', -3.5,   -6.49, 1.001, 1,1,1)
        .tex(0,5).box('rightSub2', -2.998, -6.49, 2.001, 1,1,1)

      .flip()
      .tex(12,16).box('leftBase', 2,     -6,    1,     2,2,2)
        .tex(0,3).box('leftSub1', 2.5,   -6.49, 1.001, 1,1,1)
        .tex(0,5).box('leftSub2', 1.998, -6.49, 2.001, 1,1,1);
  }

  initWings () {
    this.addSub('leftWing',  BatWingRenderer, false, 16);
    this.addSub('rightWing', BatWingRenderer, true,  16);

    this.foldWings();
  }
}
