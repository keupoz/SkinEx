import { Mesh } from 'three'

const VERTICES = [ [0,3,1], [3,2,1] ];

export default class Mixin extends Mesh {
  constructor (geometry, material) {
    super(geometry, material);
  }

  setUVs (options) {
    let uvs = this.geometry.faceVertexUvs[0];

    options.forEach((options, index) => {
      let [ x,y, w,h, turn = 0, mirror ] = options;

      if (mirror) [ x, w ] = [ x + w, -w ];

      let vertices = [ [0,0], [w,0], [w,h], [0,h] ];
      vertices.forEach(vertice => {
        vertice[0] =     (vertice[0] + x) / this.material.UVWidth;
        vertice[1] = 1 - (vertice[1] + y) / this.material.UVHeight;
      });

      function v (triangleIndex, verticeIndex) {
        let index = VERTICES[triangleIndex][verticeIndex] - turn;
        if (index < 0) index += 4;
        return vertices[index];
      }

      uvs.slice(index * 2, index * 2 + 2).forEach(function (triangle, triangleIndex) {
        triangle.forEach(function (vertice, verticeIndex) {
          vertice.set(...v(triangleIndex, verticeIndex));
        });
      });
    });

    this.geometry.uvsNeedUpdate = true;

    return this;
  }

  generateUVs   () { return this; }
  resetVertices () { return this; }

  setRotationPoint (x,y,z) {
    this.position.set(x,-y,-z);
    return this;
  }

  setRotation (x,y,z) {
    this.rotation.set(x,y,z);
    return this;
  }
}
