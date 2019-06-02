export default function registerServers (servers) {
  servers
    .setRetrieverURL('https://keupoz.herokuapp.com/ponyskins/%endpoint%/%nickname%')
    .registerServer('mc4ep',    'MC4EP', true)
    .registerServer('valhalla', 'Valhalla')
    .registerServer('legacy',   'Legacy')
    .registerServer('mojang',   'Mojang')
    .update();
}
