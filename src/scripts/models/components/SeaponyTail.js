import BoxRenderer   from '../renderers/BoxRenderer'
import PlaneRenderer from '../renderers/PlaneRenderer'

const TAIL_ROTX = Math.PI / 2;

export default class SeaponyTail extends BoxRenderer {
  init () {
    this.sub('tailBase')
      .around(-2,10,8)
      .offset(0,-4,-2)
      .flip()
      .tex(0,38).box('base', 0,4,2, 4,6,4)
      .rotate(TAIL_ROTX, 0,0);

    this.sub('tailTip')
      .around(1,5,1)
      .tex(24,0).box('tip', 0,0,0, 2,6,1);

    this.addSub('tailFins', PlaneRenderer)
      .offset(1,0,4)
      .tex(56,20).top(-8,0,0, 8,8)
          .flip().top( 0,0,0, 8,8)
      .rotate(-TAIL_ROTX,0,0);
  }
}
