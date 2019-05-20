import MergedPlanes from './MergedPlanes.js'

class MareSnout extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'face', 11,13, 1,0,0, 2,1 ],          // front top
      [ 'face', 10,14, 0,1,0, 4,2 ],          // front bottom
      [ 'land', 11,12, 1,0,0, 2,1, 2 ],       // toppest
      [ 'land',  9,14, 0,1,0, 1,1, 2 ],       // top left
      [ 'land', 14,14, 3,1,0, 1,1, 2 ],       // top right
      [ 'side', 11,12, 1,0,0, 1,1, 0, true ], // left top
      [ 'side',  9,14, 0,1,0, 2,1, 0, true ], // left bottom
      [ 'side', 12,12, 3,0,0, 1,1 ],          // right top
      [ 'side', 14,14, 4,1,0, 2,1 ],          // right bottom
      [ 'land', 18, 7, 0,3,0, 4,1, 0, true ]  // bottom
    ]);
  }
}

class StallionSnout extends MergedPlanes {
  constructor (material) {
    super(material, [
      [ 'face', 10,13, 0,0,0, 4,3 ],          // front
      [ 'land', 10,13, 0,0,0, 4,1, 2 ],       // top
      [ 'land', 18, 7, 0,3,0, 4,1, 0, true ], // bottom
      [ 'side', 10,13, 0,0,0, 3,1, 0, true ], // left
      [ 'side', 13,13, 4,0,0, 3,1 ],          // right
    ]);
  }
}

export { MareSnout, StallionSnout }
