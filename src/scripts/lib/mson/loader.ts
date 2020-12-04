import { Object3D } from "three";
import { ModelDecoder } from "./decoders";
import { of } from "./incomplete";
import { ComponentType, MsonComponent, MsonFile, MsonLoader, MsonModel } from "./types/loader";
import { clone, copy, createTexture, map } from "./utils";

const COMPONENT_TYPES: Record<string, ComponentType<any, any>> = {},
    DEFAULT_TEXTURE = createTexture([0, 0, 64, 32]);

export function createFile(body: any): MsonFile {
    body = typeof body === "string" ? JSON.parse(body) : body;

    const rawModel = ModelDecoder.runWithException(body);

    function loadElements(loader: MsonLoader, model: MsonModel) {
        const { rawLocals, locals, texture } = model,
            components = map(rawModel.components, (component, name) => {
                return loader.getComponent(component, "mson:compound", model, rawLocals, locals, texture, name);
            });

        return components;
    }

    return {
        getSkeleton(loader, rawLocals, texture) {
            const skeleton: MsonModel = rawModel.parent ? loader.getModel(rawModel.parent) : {
                name: "__root__",
                rawLocals: rawLocals ? clone(rawLocals) : {},
                locals: {},
                components: {},
                texture: texture ? clone(texture) : DEFAULT_TEXTURE,
                scale: 0,

                render() { return new Object3D(); }
            };

            copy(skeleton.rawLocals, rawModel.locals || {});
            copy(skeleton.locals, rawModel.locals ? map(rawModel.locals, of) : {});
            skeleton.texture = createTexture(rawModel.texture, skeleton.texture);

            return skeleton;
        },

        getElements(loader, skeleton) {
            if (rawModel.parent) loader.getFile(rawModel.parent).getElements(loader, skeleton);

            copy(skeleton.components, loadElements(loader, skeleton));

            return skeleton;
        },

        getModel(loader, rawLocals, texture) {
            const parent = this.getElements(loader, this.getSkeleton(loader, rawLocals, texture));

            parent.render = function render(createMesh) {
                const model = new Object3D();

                Object.values(this.components).forEach((component) => {
                    const child = component.render(createMesh);
                    model.add(child);
                });

                return model;
            };

            return parent;
        }
    };
}

/**
 * The core of Mson's model loading functionality.
 *
 * Usage:
 * ```typescript
 * const loader = Mson.createLoader();
 * loader.addFile("skeleton", "<json data>");
 * loader.addFile("pony", "<json data>");
 *
 * const skeletonModel = loader.getModel("skeleton");
 *
 * skeletonModel.render();
 * ```
 */
export function createLoader(): MsonLoader {
    const files = new Map<string, MsonFile>();

    return {
        addFile(filename, body) {
            files.set(filename, createFile(body));
        },

        getFile(filename) {
            const file = files.get(filename);

            if (!file) throw new Error(`Missing file "${filename}"`);

            return file;
        },

        getComponent(body, defaultId, model, rawLocals, locals, texture, name) {
            if (typeof body === "string") return createLink(body, model, name);

            const type = COMPONENT_TYPES[body.type || defaultId];

            if (!type) return null;

            function createElement(body: any) {
                const element: MsonComponent = { name, render: type.render };
                copy(element, body);
                return element;
            }

            body = type.decoder.runWithException(body);

            // ({ loader, name, model, locals, texture, body, createElement });
            const result = type.parse({ loader: this, name, model, rawLocals, locals, texture, body, createElement });
            return result;
        },

        getModel(filename, rawLocals, texture) {
            console.info(`Requested model "${filename}"`);
            return this.getFile(filename).getModel(this, rawLocals, texture);
        }
    };
}

function createLink(id: string, model: MsonModel, name: string): MsonComponent {
    if (id.indexOf("#") != 0) throw new Error(`Link name should begin with a "#".`);

    id = id.substr(1);

    let rendering: boolean;

    return {
        name,

        render(createObject) {
            if (rendering) throw new Error("Cyclic reference in link");

            rendering = true;
            const object = model.components[id].render(createObject);
            rendering = false;

            return object;
        }
    };
}

export function addElementType<T, K>(type: string, elementType: ComponentType<T, K>) {
    COMPONENT_TYPES[type] = elementType;
}
