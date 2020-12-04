import { ModelManager } from "../ModelManager";

export function registerModels(modelManager: ModelManager) {
    return Promise.all([
        modelManager.addFile("mson:biped"),
        modelManager.addFile("mson:steve"),
        modelManager.addFile("mson:alex"),
        modelManager.addFile("minelittlepony:components/snout"),
        modelManager.addFile("minelittlepony:components/ears"),
        modelManager.addFile("minelittlepony:components/tail_segment"),
        modelManager.addFile("minelittlepony:components/tail"),
        modelManager.addFile("minelittlepony:steve_pony")
    ]);
}
