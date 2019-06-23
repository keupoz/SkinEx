import saveAs from 'file-saver'

import ICCRemover from '../ICCRemover'

export default class FileManager {
  constructor (skin, pixels, model) {
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

  loadBuffer (buff) {
    return new Promise((resolve, reject) => {
      buff = ICCRemover.clear(buff);

      if (!buff) reject('Couldn\'t parse PNG');

      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        this.skin.setSkin(img);
        this.model.update();
        this.pixels.update();

        resolve();
      };
      img.src = URL.createObjectURL(new Blob([ buff ], { type: 'image/png' }));
    });
  }

  async loadSkin (url) {
    let response = await fetch(url);

    if (response.ok) {
      let buff = await response.arrayBuffer();
      this.skin.setSlim(response.headers.get('X-Model') == 'slim');
      await this.loadBuffer(buff);
      return { response, err: '' };
    } else return { response, err: 'Got not OK response (' + response.status + ')' };
  }

  loadBlob (blob) {
    return new Promise((resolve, reject) => {
      let F = new FileReader();
      F.onload = () => this.loadBuffer(F.result).then(() => resolve());
      F.onerror = () => reject('Couldn\'t read file');
      F.readAsArrayBuffer(blob);
    });
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
