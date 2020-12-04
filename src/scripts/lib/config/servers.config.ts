import { Servers } from "../ServerManager";
import { template } from "../utils";

export function getServers(): Servers {
    return [
        ["Valhalla", template`https://keupoz.herokuapp.com/ponyskins/valhalla/${"NICKNAME"}`],
        ["Legacy", template`https://keupoz.herokuapp.com/ponyskins/legacy/${"NICKNAME"}`],
        ["Mojang", template`https://keupoz.herokuapp.com/ponyskins/mojang/${"NICKNAME"}`]
    ];
}
