import { Face3 } from 'three/src/core/Face3.js'
import { Geometry } from 'three/src/core/Geometry.js'
import { Vector2 } from 'three/src/math/Vector2.js'
import { Vector3 } from 'three/src/math/Vector3.js'

import Mixin from './Mixin.js'
import Plane from './Plane.js'

export default class MergedPlanes extends Mixin {
  constructor (material, options) {
    super(new Geometry(), material);

    this.UVOptions = new Array();
    this.geometry.faceVertexUvs[0] = new Array();

    options.forEach(plane => {
      let [ type, sx,sy, ox,oy,oz, w_,h_, turn = 0, mirror = false ] = plane,
          [ w,h,d ] = [ 0,0,0 ],
          offset = this.geometry.vertices.length;

      switch (type) {
        case 'face': [ w,h,d ] = [ w_,h_,0 ]; break;
        case 'land': [ w,h,d ] = [ w_,0,h_ ]; break;
        case 'side':
          [ w_,h_ ] = [   h_,w_ ];
          [ w,h,d ] = [ 0,h_,w_ ];
          break;
      }

      let x  =    ox, y  =    -oy, z  =    -oz,
          x2 = w + x, y2 = -h + y, z2 = -d + z,

          vertices = [0,0,0,0].map(() => new Vector3(0,0,0)),
          uvs = [0,0].map(() => [0,0,0].map(() => new Vector2(0,0)));

      Plane[type](vertices, x,y,z, x2,y2,z2);
      this.geometry.vertices.push(...vertices);
      this.geometry.faces.push(
        new Face3(offset,     offset + 2, offset + 1),
        new Face3(offset + 2, offset + 3, offset + 1)
      );
      this.geometry.faceVertexUvs[0].push(...uvs);
      this.UVOptions.push([ sx,sy, w_,h_, turn, mirror ]);
    });

    this.geometry.computeFaceNormals();

    this.generateUVs();
    this.resetVertices();
  }

  generateUVs () {
    this.setUVs(this.UVOptions);
  }
}
