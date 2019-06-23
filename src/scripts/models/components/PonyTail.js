import AbstractRenderer from '../renderers/AbstractRenderer'

import TailSegment from './TailSegment'

export default class PonyTail extends AbstractRenderer {
  constructor (material, skin) {
    super(material, skin);

    let tailLength = 4;

    for (let i = 0; i < tailLength; i++)
      this.addSub('tailSegment' + i, TailSegment).init(i);
  }

  setLength (tailLength) {
    this.remove.apply(this, this.subsList);

    for (let i = 0; i < tailLength; i++)
      this.add(this.getSub('tailSegment' + i));
  }
}
