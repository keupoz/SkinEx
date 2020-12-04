import { Mesh } from "three";
import { Material } from "./Material";
import { createLoader } from "./mson";
import { template } from "./utils";

const MODEL_PATH = template`assets/models/${"NAMESPACE"}/${"PATH"}.json`;

export class ModelManager {
    public readonly loader = createLoader();

    public readonly material: Material;

    constructor(skinCanvas: HTMLCanvasElement) {
        this.material = new Material(skinCanvas);
    }

    public async addFile(name: string) {
        console.info(`Adding file "${name}"`);

        const [namespace, path] = name.split(":"),
            response = await fetch(MODEL_PATH(namespace, path));

        if (response.status !== 200) throw new Error(`Can't load model "${name}"`);

        const json = await response.json();

        this.loader.addFile(name, json);
    }

    public getModel(name: string) {
        return this.loader.getModel(name).render((geometry) => {
            return new Mesh(geometry, this.material);
        });
    }
}
