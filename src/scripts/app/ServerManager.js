export default class ServerManager {
  constructor () {
    this.retrieverURL = '';
    this.servers = [];
    this.current = null;
  }

  setRetrieverURL (url) {
    this.retrieverURL = url;

    return this;
  }

  registerServer (endpoint, label, tokenRequired) {
    this.servers.push({
      endpoint, label,
      tokenRequired,
      value: endpoint,
      disabled: tokenRequired
    });

    return this;
  }

  setCurrent (server) {
    this.current = server;
    localStorage.setItem('server', server.endpoint);

    return this;
  }

  update () {
    let endpoint = localStorage.getItem('server');
    if (endpoint) this.current = this.servers.find(server => server.endpoint == endpoint);
    else this.current = this.servers.find(server => !server.disabled);

    return this;
  }

  getSkinURL (nickname, recursive) {
    let url = this.retrieverURL;

    url = url.replace(/%endpoint%/g, this.current.endpoint);
    url = url.replace(/%nickname%/g, nickname);

    if (recursive) url += '?recursive';

    return url;
  }
}
