import FileManager   from './FileManager'
// import GearManager   from './GearManager'
import ModelManager  from './ModelManager'
import PixelManager  from './PixelManager'
import Renderer      from './Renderer'
import ServerManager from './ServerManager'
import SkinManager   from './SkinManager'

import { appname, version } from '../../../package.json'

export default class App {
  constructor () {
    this.name    = appname;
    this.version = version;

    this.skin   = new SkinManager();
    this.model  = new ModelManager(this.skin);
    this.pixels = new PixelManager(this.skin, this.model);

    this.server = new ServerManager();
    // this.gears  = new GearManager();
    this.file   = new FileManager(this.skin, this.pixels, this.model);

    this.renderer = new Renderer(this.model);

    this.ready = false;
    this.lastError = '';

    this.loading = false;
    this.lastRetrieveError = '';

    this.init();
  }

  error (method, err) {
    this.lastError = method + ': ' + err;
    console.error(this.lastError);
  }

  init () {
    Promise.all([
      /* this.gears.loadTexture('antlers', 'assets/textures/antlers.png'),
      this.gears.loadTexture('muffin',  'assets/textures/muffin.png'),
      this.gears.loadTexture('stetson', 'assets/textures/stetson.png') */
    ])
    .then(() => this.file.loadSkin('assets/skins/DaringDo.png'))
    .then(({ err }) => {
      if (err) return this.error('App.init', 'Couldn\'t load default skin');
      this.ready = true;
    }).catch((err) => {
      this.error('App.init', err);
    });
  }

  async retrieveSkin (nickname, recursive) {
    try {
      this.loading = true;
      this.lastRetrieveError = '';

      let url = this.server.getSkinURL(nickname, recursive);

      let r = await this.file.loadSkin(url);
      this.loading = false;

      if (r.err) {
        let json = await r.response.json();
        this.error('App.retrieveSkin', json.error);
        this.lastRetrieveError = json.error;
      }
    } catch (err) {
      this.error('App.retrieveSkin', err);
      this.lastRetrieveError = err.toString();
    }
  }
}
