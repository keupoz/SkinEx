export default function registerServers (servers) {
  servers
    .setRetrieverURL('https://keupoz.herokuapp.com/ponyskins/%endpoint%/%nickname%')
    .registerServer('valhalla', 'Valhalla')
    .registerServer('legacy',   'Legacy')
    .registerServer('mojang',   'Mojang')
    .update();
}
