import { Geometry, Face3, Vector2, Vector3 } from 'three'

import Mixin from './Mixin'
import Planes from './Planes'

export default class Plane extends Mixin {
  constructor (material, textureX, textureY, xMin, yMin, zMin, w, h, d, scale, face, mirrorx, mirrory, mirrorz) {
    super(new Geometry(), material);

    this.textureX = textureX;
    this.textureY = textureY;

    this.mirror = mirrorx || mirrory || mirrorz;

    if (this.mirror)
      switch (true) {
        case mirrorx: this.turn = 0; break;
        case mirrory: this.turn = 0; break;
        case mirrorz: this.turn = 2; break;
      }
    else this.turn = 0;

    switch (face) {
      case Planes.EAST:  case Planes.WEST:  this.width = d; this.height = h; break;
      case Planes.UP:    case Planes.DOWN:  this.width = w; this.height = d; break;
      case Planes.SOUTH: case Planes.NORTH: this.width = w; this.height = h; break;
    }

    this.resetVertices(xMin, yMin, zMin, w, h, d, scale, face, mirrorx, mirrory, mirrorz);
    this.generateUVs();
  }

  resetVertices (xMin, yMin, zMin, w, h, d, scale, face, mirrorx, mirrory, mirrorz) {
    let xMax = xMin + w + scale,
        yMax = yMin + h + scale,
        zMax = zMin + d + scale;

    xMin -= scale;
    yMin -= scale;
    zMin -= scale;

    if (mirrorx) [ xMax, xMin ] = [ xMin, xMax ];
    if (mirrory) [ yMax, yMin ] = [ yMin, yMax ];
    if (mirrorz) [ zMax, zMin ] = [ zMin, zMax ];

    // w:west e:east d:down u:up s:south n:north
    let wds = new Vector3(xMin, -yMin, -zMin),
        eds = new Vector3(xMax, -yMin, -zMin),
        eus = new Vector3(xMax, -yMax, -zMin),
        wus = new Vector3(xMin, -yMax, -zMin),
        wdn = new Vector3(xMin, -yMin, -zMax),
        edn = new Vector3(xMax, -yMin, -zMax),
        eun = new Vector3(xMax, -yMax, -zMax),
        wun = new Vector3(xMin, -yMax, -zMax);

    let vertices;

    switch (face) {
      case Planes.EAST:  vertices = [ edn, eds, eus, eun ]; break;
      case Planes.WEST:  vertices = [ wds, wdn, wun, wus ]; break;
      case Planes.UP:    vertices = [ edn, wdn, wds, eds ]; break;
      case Planes.DOWN:  vertices = [ eus, wus, wun, eun ]; break;
      case Planes.SOUTH: vertices = [ eds, wds, wus, eus ]; break;
      case Planes.NORTH: vertices = [ wdn, edn, eun, wun ]; break;
    }

    this.geometry.vertices = vertices;
    this.geometry.faces = [ new Face3(1, 2, 0), new Face3(2, 3, 0) ];
    this.geometry.faceVertexUvs[0] = [0,0].map(() => [0,0,0].map(() => new Vector2(0,0)));

    if (mirrorx || mirrory || mirrorz) this.geometry.vertices.reverse();

    this.geometry.computeFaceNormals();
  }

  generateUVs () {
    return this.setUVs([[ this.textureX, this.textureY, this.width, this.height, this.turn, this.mirror ]]);
  }
}
