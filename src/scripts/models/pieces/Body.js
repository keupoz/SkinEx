import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'

import MergedPlanes from './MergedPlanes.js'
import ModelGroup from './ModelGroup.js'

import Wings from './Wings.js'

class Neck extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'face', 0,16, -2,1.2,-2.8, 4,4 ],          // front
      [ 'face', 0,16, -2,1.2, 1.2, 4,4 ],          // back
      [ 'side', 0,16, -2,1.2,-2.8, 4,4, 0, true ], // left
      [ 'side', 0,16,  2,1.2,-2.8, 4,4 ]           // right
    ]);
  }
}

class Stomach extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'side', 24, 0, 0,0,0, 8,8 ],          // left
      [ 'side', 24, 0, 8,0,0, 8,8 ],          // right
      [ 'land', 32,20, 0,0,0, 8,8, 0, true ], // top
      [ 'land', 56, 0, 0,8,0, 8,8, 0, true ], // bottom
    ]);
  }
}

class Butt extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'land', 32,28, 0,0,0, 8,4, 0, true ], // top
      [ 'land', 36,16, 0,8,0, 8,4, 0, true ], // bottom
      [ 'side',  4, 0, 0,0,0, 8,4 ],          // left
      [ 'side',  4, 0, 8,0,0, 8,4 ],          // right
      [ 'face', 36,16, 0,0,4, 8,4 ],          // top back
      [ 'face', 36,16, 0,4,4, 8,4 ],          // bottom back
    ]);
  }
}

class Stub extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'land', 32,0, -1,10, 8, 2,6, 2 ],       // top
      [ 'land', 32,0, -1,12, 8, 2,6, 0, true ], // bottom
      [ 'side', 32,0, -1,10, 8, 2,6, 0, true ], // left
      [ 'side', 32,0,  1,10, 8, 2,6 ],          // right
      [ 'face', 32,0, -1,10,14, 2,2 ]           // back
    ]);
  }
}

class TailPiece extends MergedPlanes {
  constructor (material, index) {
    let textureY = index % 2 ? 4 : 0,
        y = 1 + 4 * index,
        planes = [
        [ 'side', 36,textureY, -2,    y,2, 4,4, 0, true ], // left
        [ 'face', 32,textureY, -2,    y,2, 4,4 ],          // front
        [ 'side', 36,textureY,  2,    y,2, 4,4 ],          // right
        [ 'face', 32,textureY, -2,    y,6, 4,4 ],          // back
        [ 'land', 32,       0, -2,4 + y,2, 4,4, 2 ]        // bottom
      ];

    if (index == 0) planes.unshift([ 'land', 32,0, -2,1,2, 4,4, 2 ]);

    super(material, planes);
  }
}

export { Neck, Stomach, Butt, Stub, TailPiece, Wings }
