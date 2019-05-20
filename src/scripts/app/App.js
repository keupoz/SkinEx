import FileManager  from './FileManager'
import ModelManager from './ModelManager'
import PixelManager from './PixelManager'
import Renderer     from './Renderer'
import SkinManager  from './SkinManager'

import { appname, version } from '../../../package.json'

export default class App {
  constructor () {
    this.name    = appname;
    this.version = version;

    this.skin   = new SkinManager();
    this.model  = new ModelManager(this.skin);
    this.pixels = new PixelManager(this.skin, this.model);
    this.file   = new FileManager(this, this.skin, this.pixels, this.model);

    this.renderer = new Renderer(this.model);

    this.ready = false;
    this.lastError = '';

    this.init();
  }

  error (method, err) {
    this.lastError = method + ': ' + err;
    console.error(this.lastError);
  }

  init () {
    this.file.loadSkin('./assets/skins/DaringDo.png', (err) => {
      if (!err) this.ready = true;
    });
  }
}
