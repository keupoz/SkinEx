import ColorPixel  from '../pixels/ColorPixel'
import CommonPixel from '../pixels/CommonPixel'
import MaskPixel   from '../pixels/MaskPixel'
import RacePixel   from '../pixels/RacePixel'
import RangePixel  from '../pixels/RangePixel'

import ModelPlayer     from '../models/ModelPlayer'
import ModelEarthpony  from '../models/ModelEarthpony'
import ModelPegasus    from '../models/ModelPegasus'
import ModelUnicorn    from '../models/ModelUnicorn'
import ModelAlicorn    from '../models/ModelAlicorn'
import ModelChangeling from '../models/ModelChangeling'
import ModelZebra      from '../models/ModelZebra'
import ModelBatpony    from '../models/ModelBatpony'
import ModelSeapony    from '../models/ModelSeapony'

export default function registerPixels (pixels) {
  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/pony/meta/Race.java
  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/client/model/races/PlayerModels.java
  // mask: isPony, isSeapony, hasHorn, hasWings
  pixels
    .registerPixel(RacePixel, 0,0, 'RACE', true)
      .add('NONE',                0x000000, 0b0000, ModelPlayer)
      .add('EARTHPONY',           0xf9b131, 0b1000, ModelEarthpony)
      .add('PEGASUS',             0x88caf0, 0b1001, ModelPegasus)
      .add('UNICORN',             0xd19fe4, 0b1010, ModelUnicorn)
      .add('ALICORN',             0xfef9fc, 0b1011, ModelAlicorn)
      .add('CHANGELING',          0x282b29, 0b1011, ModelChangeling)
      .add('ZEBRA',               0xd0cccf, 0b1000, ModelZebra)
      .add('REFORMED_CHANGELING', 0xcaed5a, 0b1011, ModelChangeling)
      .add('GRIFFIN',             0xae9145, 0b1001, ModelPegasus)
      .add('HIPPOGRIFF',          0xd6ddac, 0b1001, ModelPegasus)
      .add('BATPONY',             0xeeeeee, 0b1001, ModelBatpony)
      .add('SEAPONY',             0x3655dd, 0b1110, ModelSeapony)
      .updateModel(function updateRace (model, byUser) {
        let raceModel = this.current.extra.model;

        if (model !== raceModel) {
          this.model.setModel(raceModel);
          if (byUser) this.parent.updateModel();
          return false;
        }
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/pony/meta/TailLength.java
  pixels
    .registerPixel(RangePixel, 1,0, 'TAIL_LENGTH')
      .add('STUB',           0x425844)
      .add('QUARTER',        0xd19fe4)
      .add('HALF',           0x534b76)
      .add('THREE_QUARTERS', 0x8a6b7f)
      .add('FULL',           0x000000)
      .updateModel(function updateTail (model) {
        if (!(model instanceof ModelEarthpony)) return false;

        model.tail.setLength(this.current.extra);
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/pony/meta/Gender.java
  pixels
    .registerPixel(CommonPixel, 2,0, 'SNUZZLE')
      .add('FEMALE',      0x000000)
      .add('MALE',        0xffffff)
      .add('ABOMONATION', 0x888888)
      .updateModel(function updateSnuzzle (model) {
        if (!(model instanceof ModelEarthpony)) return false;

        model.snout.setGender(this.current.name);
      });

  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/pony/meta/Size.java
  pixels
    .registerPixel(CommonPixel, 3,0, 'MODEL_SIZE')
      .add('TALL',     0x534b76)
      .add('BULKY',    0xce3254)
      .add('LANKY',    0x3254ce)
      .add('NORMAL',   0x000000)
      .add('YEARLING', 0x53beff)
      .add('FOAL',     0xffbe53);

  // https://github.com/MineLittlePony/MineLittlePony/blob/master/src/main/java/com/minelittlepony/pony/meta/Wearable.java
  pixels
    .registerPixel(MaskPixel, 1,1, 'WEARABLES')
      .add('MUFFIN',       50)
      .add('HAT',         100)
      .add('ANTLERS',     150)
      .add('SADDLE_BAGS', 200)
      .add('STETSON',     250)
      .updateModel(function updateWearables () {
        console.log('MaskPixel list', JSON.parse(JSON.stringify(this.selected)));
      });

  pixels
    .registerPixel(ColorPixel, 0,1, 'MAGIC_COLOR', false, 0x4444aa)
      .updateModel(function updateMagic (model) {
        if (!(model instanceof ModelUnicorn)) return false;

        model.horn.setGlowColor(this.getColor());
      });
}
