import biped from "./lib/biped.json";
import { createLoader } from "./lib/mson";
import quadruped from "./lib/quadruped.json";

const MsonLoader = createLoader();

MsonLoader.addFile("biped", biped);
MsonLoader.addFile("quadruped", quadruped);

console.log(MsonLoader.getModel("biped"));
console.log(MsonLoader.getModel("quadruped"));
