import BoxRenderer   from '../renderers/BoxRenderer'
import PlaneRenderer from '../renderers/PlaneRenderer'

export default class Stetson extends PlaneRenderer {
  init () {
    this
      .tex(16,33).top(-9,-4,-12, 16,17)
      .tex(0,33).bottom(-9,-3.999,-12, 16,17)
      .rotate(-0.3,0,0.1);

    this.addSub('sub1', BoxRenderer)
        .tex(0,0) .box('child1', -5,-8,-6,  9,4,9)
        .tex(0,13).box('child1', -6,-6,-7, 11,2,11);

    this.addSub('sub2', BoxRenderer)
      .around(-9,-4,-12)
      .tex(0,27).south(0,-6,0, 16,6)
      .rotate(0.4,0,0);
  }
}
