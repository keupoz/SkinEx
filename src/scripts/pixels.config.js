import ColorPixel  from './pixels/ColorPixel'
import CommonPixel from './pixels/CommonPixel'
import MaskPixel   from './pixels/MaskPixel'
import RacePixel   from './pixels/RacePixel'
import RangePixel  from './pixels/RangePixel'

import ModelHuman from './models/ModelHuman'
import ModelPony from './models/ModelPony'

export default function registerPixels (pixels) {
  // https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2.3.2.1/src/main/java/com/minelittlepony/pony/data/PonyRace.java
  // mask: isPony, isSeapony, hasHorn, hasWings
  pixels
    .registerPixel(RacePixel, 0,0, 'RACE', true)
      .add('NONE',                0x000000, 0b0000, ModelHuman)
      .add('EARTHPONY',           0xf9b131, 0b1000, ModelPony)
      .add('PEGASUS',             0x88caf0, 0b1001, ModelPony)
      .add('UNICORN',             0xd19fe4, 0b1010, ModelPony)
      .add('ALICORN',             0xfef9fc, 0b1011, ModelPony)
      .add('CHANGELING',          0x282b29, 0b1011, ModelPony)
      .add('ZEBRA',               0xd0cccf, 0b1000, ModelPony)
      .add('REFORMED_CHANGELING', 0xcaed5a, 0b1011, ModelPony)
      .add('GRIFFIN',             0xae9145, 0b1001, ModelPony)
      .add('HIPPOGRIFF',          0xd6ddac, 0b1001, ModelPony)
      .add('BATPONY',             0xeeeeee, 0b1001, ModelPony)
      .add('SEAPONY',             0x3655dd, 0b1110, ModelPony)
      .updateModel(function updateRace () {
        let { model } = this.current.extra;

        if (model instanceof ModelPony) {
          let { head, horn, hornGlow, wings, batEars, bodyGroup } = model;

          if (this.hasHorn) head.add(horn, hornGlow);
          else head.remove(horn, hornGlow);

          if (this.hasWings) bodyGroup.add(wings);
          else bodyGroup.remove(wings);

          if (this.current.name == 'BATPONY') head.add(batEars);
          else head.remove(batEars);
        }

        if (this.model.current !== model) {
          this.model.setModel(model);
          return true;
        }
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2.3.2.1/src/main/java/com/minelittlepony/pony/data/TailLengths.java
  pixels
    .registerPixel(RangePixel, 1,0, 'TAIL_LENGTH')
      .add('STUB',           0x425844)
      .add('QUARTER',        0xd19fe4)
      .add('HALF',           0x534b76)
      .add('THREE_QUARTERS', 0x8a6b7f)
      .add('FULL',           0x000000)
      .updateModel(function updateTail (model) {
        if (!(model instanceof ModelPony)) return true;

        let { tail, tailBak } = model;

        tail.remove(...tailBak);

        let tailLength = this.current.extra;

        if (tailLength)
          for (let i = 0; i < tailLength; i++)
            tail.add(tailBak[i]);
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2.3.2.1/src/main/java/com/minelittlepony/pony/data/PonyGender.java
  pixels
    .registerPixel(CommonPixel, 2,0, 'SNUZZLE')
      .add('FEMALE',      0x000000)
      .add('MALE',        0xffffff)
      .add('ABOMONATION', 0x888888)
      .updateModel(function updateSnuzzle (model) {
        if (!(model instanceof ModelPony)) return true;

        let { snout, stallionSnout, mareSnout } = model;

        snout.remove(stallionSnout, mareSnout);

        switch (this.current.name) {
          case 'FEMALE': snout.add(mareSnout); break;
          case 'MALE':   snout.add(stallionSnout); break;
        }
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2.3.2.1/src/main/java/com/minelittlepony/pony/data/PonySize.java
  pixels
    .registerPixel(CommonPixel, 3,0, 'MODEL_SIZE')
      .add('TALL',     0x534b76)
      .add('BULKY',    0xce3254)
      .add('LANKY',    0x3254ce)
      .add('NORMAL',   0x000000)
      .add('YEARLING', 0x53beff)
      .add('FOAL',     0xffbe53);

  pixels
    .registerPixel(ColorPixel, 0,1, 'MAGIC_COLOR', false, 0x4444aa)
      .updateModel(function updateMagic (model) {
        if (!(model instanceof ModelPony)) return true;

        let color = this.getColor();
        model.hornGlow.children.forEach(child => child.material.color.set(color));
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2.3.2.1/src/main/java/com/minelittlepony/pony/data/PonyWearable.java
  pixels
    .registerPixel(MaskPixel, 1,1, 'WEARABLES')
      .add('MUFFIN',       50)
      .add('HAT',         100)
      .add('ANTLERS',     150)
      .add('SADDLE_BAGS', 200)
      .add('STETSON',     250);
}
