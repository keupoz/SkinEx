import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { AmbientLight } from 'three/src/lights/AmbientLight'
import { DirectionalLight } from 'three/src/lights/DirectionalLight'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { Scene } from 'three/src/scenes/Scene'

import { Raycaster } from 'three/src/core/Raycaster'
import { BoxHelper } from 'three/src/helpers/BoxHelper'
import { Vector2 } from 'three/src/math/Vector2'

import { OrbitControls } from './OrbitControls'

export default class Renderer {
  constructor (model) {
    this.model = model;

    this.output = new WebGLRenderer({ alpha: true });
    this.scene  = new Scene();
    this.camera = new PerspectiveCamera(45, 1, 0.1, 500);

    this.canvas = this.output.domElement;

    this.light = new DirectionalLight(0x7f7f7f);

    // Camera Initialization
    this.camera.position.set(32,16,32);
    this.camera.lookAt(0,0,0);

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.pointer     = new Vector2(0,0);
    this.raycaster   = new Raycaster();
    this.highlight   = new BoxHelper(undefined, 0xffffff);
    this.focusHelper = new BoxHelper(undefined, 0xffffff);

    this.intersect     = null;
    this.selectedPiece = null;

    // Controls Initialization
    this.controls.enableKeys     = false;
    this.controls.zoomSpeed      = 2;
    this.raycaster.linePrecision = 0;

    // Events
    this.canvas.addEventListener('mousemove',  e => this.updatePointer(e));
    this.canvas.addEventListener('touchmove',  e => this.updatePointer(e.changedTouches[0]));
    this.canvas.addEventListener('touchstart', e => this.updatePointer(e.changedTouches[0]));

    this.canvas.addEventListener('dblclick', this.updateFocus.bind(this, false));

    this.controls.addEventListener('change', this.render.bind(this));

    // Scene
    this.scene.add(new AmbientLight(0x808080), this.light);
    this.scene.add(model);

    window.addEventListener('resize', this.updateSize.bind(this));

    model.render((resetFocus) => {
      if (resetFocus) this.resetFocus();
      else this.updateFocus(true);
    });
  }

  updateSize () {
    this.setSize(this.canvas.parentElement.offsetWidth, this.canvas.parentElement.offsetHeight);

    return this;
  }

  setSize (width, height) {
    this.output.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.render();

    return this;
  }


  updatePointer ({ clientX, clientY }) {
    let { top, left, width, height } = this.canvas.getBoundingClientRect();

    this.pointer.x = -1 + 2 * (clientX - left) / width;
    this.pointer.y =  1 - 2 * (clientY - top)  / height;

    this.updateHighlight();
  }

  updateHighlight () {
    this.raycaster.setFromCamera(this.pointer, this.camera);

    let intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length) {
      let { object }  = intersects[0],
          { intersectable } = object;

      if (object.parent) {
        while (object.parent && !intersectable) {
          object = object.parent;
          ({ intersectable } = object);
        }
        if (intersectable) this.intersect = object;
        else this.intersect = intersects[0].object;
      } else this.intersect = object;

      this.highlight.setFromObject(this.intersect).update();
      this.scene.add(this.highlight);
      this.render();
      return true;
    } else if (this.intersect && !intersects.length) {
      this.scene.remove(this.highlight);
      this.intersect = null;
      this.render();
      return true;
    }
  }

  resetFocus () {
    this.focusHelper.setFromObject(this.model.current.getSub('body')).update();
    this.controls.target.copy(this.focusHelper.geometry.boundingSphere.center);
    this.light.target.position.copy(this.controls.target);
    this.selectedPiece = null;
    this.controls.update();
    !this.updateHighlight() && this.render();
  }

  updateFocus (force) {
    if (force && !this.selectedPiece) return this.resetFocus();
    if (!force && this.intersect && this.intersect == this.selectedPiece) return;

    if (force || this.intersect) {
      if (!force) this.selectedPiece = this.intersect;
      this.controls.target.copy(this.highlight.geometry.boundingSphere.center);
      this.light.target.position.copy(this.controls.target);
      this.controls.update();
      !this.updateHighlight() && this.render();
    } else this.resetFocus();
  }


  render () {
    this.light.position.copy(this.camera.position);
    this.output.render(this.scene, this.camera);

    return this;
  }
}
