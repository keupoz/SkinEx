export default {
  face (vertices, x,y,z, x2,y2,z2) {
    vertices[0].set(x, y, z);
    vertices[1].set(x2,y, z);
    vertices[2].set(x, y2,z);
    vertices[3].set(x2,y2,z);
  },

  land (vertices, x,y,z, x2,y2,z2) {
    vertices[0].set(x2,y,z);
    vertices[1].set(x, y,z);
    vertices[2].set(x2,y,z2);
    vertices[3].set(x, y,z2);
  },

  side (vertices, x,y,z, x2,y2,z2) {
    vertices[0].set(x,y, z);
    vertices[1].set(x,y, z2);
    vertices[2].set(x,y2,z);
    vertices[3].set(x,y2,z2);
  }
}
