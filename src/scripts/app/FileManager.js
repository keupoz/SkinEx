import saveAs from 'file-saver'

import ajax from '../ajax'
import ICCRemover from '../ICCRemover'

export default class FileManager {
  constructor (app, skin, pixels, model) {
    this.app    = app;
    this.skin   = skin;
    this.pixels = pixels;
    this.model  = model;

    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';

    input.addEventListener('change', () => {
      if (!input.files.length) return;

      this.loadBlob(input.files[0]);
    });

    this.input = input;
  }

  loadBuffer (buff, callback) {
    buff = ICCRemover.clear(buff);

    if (!buff) this.app.error('Couldn\'t parse PNG');

    let img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      this.skin.setSkin(img);
      this.model.update();
      this.pixels.update();
      if (callback) callback();
    };
    img.src = URL.createObjectURL(new Blob([ buff ], { type: 'image/png' }));
  }

  loadSkin (url, callback) {
    this.progress = 0;

    let xhr = ajax('GET', 'arraybuffer', url, () => {
      if (xhr.status == 200) this.loadBuffer(xhr.response, callback);
      else {
        let err = 'Got not OK response (' + xhr.status + ')';
        this.app.error('FileManager.loadSkin', err);
        if (callback) callback(err);
      }
    }, (err) => {
      this.app.error('FileManager.loadSkin', err);
      if (callback) callback(err);
    }, (e) => {
      this.progress = e.loaded / e.total;
    });
  }

  loadBlob (blob, callback) {
    let F = new FileReader();
    F.onload = () => this.loadBuffer(F.result, callback);
    F.onerror = () => this.app.error('Couldn\'t read file');
    F.readAsArrayBuffer(blob);
  }


  open () {
    this.input.click();
  }

  save () {
    this.pixels.render();
    this.skin.canvas.toBlob(function (blob) {
      saveAs(blob, 'SkinEx_' + Date.now() + '.png');
    });
  }
}
