import { querySelector } from "@keupoz/strict-queryselector";
import { isDecoderError } from "@mojotech/json-type-validation";
import { version } from "../../package.json";
import { Range } from "./lib/components/common/Range";
import { Dropzone } from "./lib/components/Dropzone";
import { Loader } from "./lib/components/Loader";
import { registerModels } from "./lib/config/models.config";
import { registerPixels } from "./lib/config/pixels.config";
import { getServers } from "./lib/config/servers.config";
import { ModelManager } from "./lib/ModelManager";
import { PixelManager } from "./lib/PixelManager";
import { SceneManager } from "./lib/SceneManager";
import { ServerManager } from "./lib/ServerManager";
import { SkinManager } from "./lib/SkinManager";
import { logOfTwo } from "./lib/utils";

async function init() {
    querySelector("#app-name", HTMLElement).setAttribute("data-version", version);

    const dropzone = new Dropzone();

    const $skinWidthLabel = querySelector("#layout-width-label .labeled--label", HTMLElement),
        skinWidth = new Range("#layout-width", 0, (value) => {
            const width = 2 ** value;
            skinManager.setSize(width);
            $skinWidthLabel.setAttribute("data-info", `${width}px`);
        }, { min: 6, max: 13 });

    querySelector("#layout-width-reset", HTMLButtonElement).addEventListener("click", () => {
        const { width } = skinManager.getOriginalSize();
        skinManager.setSize(width);
        skinWidth.setValue(logOfTwo(width));
        $skinWidthLabel.setAttribute("data-info", `${width}px`);
    });

    const skinManager = new SkinManager("#layout-preview", () => {
        const { width } = skinManager.getOriginalSize();

        pixelManager.updatePixels(skinManager);

        skinWidth.setValue(logOfTwo(width));
        $skinWidthLabel.setAttribute("data-info", `${width}px`);

        modelManager.material.update();
        sceneManager.render();
    });

    const pixelManager = new PixelManager((x, y, color) => {
        skinManager.setPixel(x, y, color);
    });

    const serverManager = new ServerManager(getServers(), (blob, nickname) => {
        skinManager.setBlob(blob, nickname);
    });

    const $previewHighlighted = querySelector("#preview-highlighted", HTMLElement);

    const sceneManager = new SceneManager((name) => {
        $previewHighlighted.innerText = name;
    });

    const modelManager = new ModelManager(skinManager.getCanvas());

    await registerModels(modelManager);
    sceneManager.setModel(modelManager.getModel("minelittlepony:steve_pony"));

    querySelector("#preview", HTMLElement).prepend(sceneManager.domElement);
    sceneManager.updateSize();

    const $skinLoadInput = document.createElement("input"),
        $skinLoad = querySelector("#skin-load", HTMLButtonElement),
        $skinSave = querySelector("#skin-save", HTMLButtonElement),
        $skinReset = querySelector("#skin-reset", HTMLButtonElement);

    $skinLoadInput.type = "file";
    $skinLoadInput.accept = "image/png";

    $skinLoadInput.addEventListener("input", async () => {
        const { files } = $skinLoadInput;

        if (!files) throw new Error("No files property on internal input");
        if (files.length < 1) throw new Error("No files selected");

        const file = files[0];

        await skinManager.setFile(file);
    });

    $skinLoad.addEventListener("click", () => {
        $skinLoadInput.click();
    });

    $skinSave.addEventListener("click", () => {
        skinManager.saveAs();
    });

    $skinReset.addEventListener("click", () => {
        skinManager.reset();
    });

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
            switch (e.code) {
                case "KeyO": $skinLoadInput.click(); break;
                case "KeyS": skinManager.saveAs(); break;
                default: return;
            }

            e.preventDefault();
        }
    });

    function getDropFile(e: DragEvent) {
        const transfer = e.dataTransfer;

        if (transfer) {
            for (let i = 0; i < transfer.files.length; i++) {
                const file = transfer.files[i];
                if (file.type === "image/png") return file;
            }
        }

        return null;
    }

    // https://stackoverflow.com/a/21002544
    let dragCounter = 0;

    document.addEventListener("dragenter", (e) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter++;
        dropzone.show();
    });

    document.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter--;
        if (dragCounter === 0) dropzone.close();
    });

    document.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = getDropFile(e);

        if (file) {
            skinManager.setFile(file);

            dragCounter = 0;
            dropzone.close();
        } else {
            dropzone.setError(true);
            setTimeout(() => {
                dragCounter = 0;
                dropzone.close();
            }, 1500);
        }
    });

    registerPixels(pixelManager);

    const defaultSkin = await serverManager.fetchCustom("assets/skins/DaringDo.png");
    await skinManager.setBlob(defaultSkin, "DaringDo");
}

(async () => {
    const loader = new Loader();

    try {
        await init();
        loader.destroy();
    } catch (err) {
        console.error("Error occurred while loading", err);

        if (isDecoderError(err)) {
            loader.showError(`${err.kind}: ${err.message}`);
        } else loader.showError(err);
    }
})();
