// Inspired by MineLP BoxRenderer
// https://github.com/MineLittlePony/MineLittlePony/blob/1.12.2/src/main/java/com/minelittlepony/util/render/AbstractBoxRenderer.java

import { Bone, Group } from 'three'

export default class AbstractRenderer extends Bone {
  constructor (material, skin, ...args) {
    super();

    this.material = material;
    this.skin     = skin;

    this.$slim   = false;
    this.$unslim = false;

    this.textureOffsetX = 0;
    this.textureOffsetY = 0;

    this.model = new Group();

    this.$mirror = false;

    this.names = {};
    this.subs  = {};

    this.slimList       = [];
    this.unslimList     = [];
    this.subsList       = [];

    this.add(this.model);

    this.init.apply(this, args);
  }

  init () {}

  setTextureOffset (x,y) {
    this.textureOffsetX = x;
    this.textureOffsetY = y;

    return this;
  }

  mirror (mirror) {
    this.$mirror = mirror;

    return this;
  }

  slim (slim) {
    this.$slim = slim;

    return this;
  }

  unslim (unslim) {
    this.$unslim = unslim;

    return this;
  }


  flip () {
    return this.mirror(!this.$mirror);
  }

  tex (x,y) {
    return this.setTextureOffset(x,y);
  }


  at (x,y,z) {
    this.offset(x / 16, y / 16, z / 16);

    return this;
  }

  offset (x,y,z) {
    this.model.position.set(x,-y,-z);

    return this;
  }

  setRotationPoint (x,y,z) {
    this.position.set(x,-y,-z);

    return this;
  }

  shiftRotationPoint (x,y,z) {
    this.position.x +=  x;
    this.position.y += -y;
    this.position.z += -z;

    return this;
  }

  rotate (x,y,z) {
    this.rotation.set(x,y,z);

    return this;
  }


  around (x,y,z) {
    return this.setRotationPoint(x,y,z);
  }


  addChild (name, child) {
    child.name = this.name + '_' + name;

    this.names[name] = child;
    this.model.add(child);

    return this;
  }

  addSub (name, SubRenderer, ...args) {
    let sub = new SubRenderer(this.material, this.skin, ...args);

    sub.name = name;

    sub.tex(this.textureOffsetX, this.textureOffsetY);

    this.subs[name] = sub;
    this.subsList.push(sub);

    if (this.$slim)   this.slimList.push(sub);
    if (this.$unslim) this.unslimList.push(sub);

    this.$slim = this.$unslim = false;

    this.add(sub);

    return sub;
  }

  getSub (name) {
    return this.subs[name];
  }

  getNamed (name) {
    return this.names[name];
  }

  remadd (remove, add) {
    this.remove.apply(this, remove).add.apply(this, add);
    return this;
  }

  remap () {
    this.subsList.forEach(function (sub) { sub.remap() });

    if (this.slimList.length) {
      if (this.skin.isSlim) {
        this.remadd(this.unslimList, this.slimList);
      } else {
        this.remadd(this.slimList, this.unslimList);
      }
    }

    return this;
  }
}
