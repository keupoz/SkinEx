import saveAs from 'file-saver'

import { downloadBuff, loadBuff } from '../utils'

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

  async loadBuffer (buff) {
    let img = await loadBuff(buff);

    this.skin.setSkin(img);
    this.model.update();
    this.pixels.update();
  }

  async loadSkin (url) {
    let { response, err, buff } = await downloadBuff(url);

    if (err) return { response, err };

    this.skin.setSlim(response.headers.get('X-Model') == 'slim');
    await this.loadBuffer(buff);

    return { response, err: '' };
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
