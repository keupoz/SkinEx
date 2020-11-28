import { of } from "./incomplete";
import { CreateTexture, Element, ElementType, FileObject, Loader, Model } from "./types/loader";

export const createTexture: CreateTexture = (body, parent) => {
    if (Array.isArray(body)) {
        return {
            u: body[0] || parent?.u || 0,
            v: body[1] || parent?.v || 0,
            w: body[2] || parent?.w || 0,
            h: body[3] || parent?.h || 0
        };
    }

    return {
        u: body?.u || parent?.u || 0,
        v: body?.v || parent?.v || 0,
        w: body?.w || parent?.w || 0,
        h: body?.h || parent?.h || 0
    };
};

const RESERVED_KEYS = "parent;locals;texture;scale".split(";"),
    ELEMENT_TYPES: Record<string, ElementType<any>> = {},
    DEFAULT_TEXTURE = createTexture([0, 0, 64, 32]);

export const objUtils = {
    map<T, K>(obj: Record<string, T>, valueMapper: (value: T, key: string) => K) {
        const result: Record<string, K> = {};
        Object.keys(obj).forEach((key) => result[key] = valueMapper(obj[key], key));
        return result;
    },

    copy<T>(to: Record<string, T>, from: Record<string, T>) {
        Object.keys(from).forEach((key) => to[key] = from[key]);
        return to;
    },

    subset(obj: Record<string, any>, keys: string[]) {
        const result: typeof obj = {};
        keys.forEach((key) => result[key] = obj[key]);
        return result;
    }
};

export function createFile(body: any): FileObject {
    const parameters = typeof body === "string" ? JSON.parse(body) : body;

    function loadElements(loader: Loader, model: Model) {
        const { locals, texture } = model,
            elementNames = Object.keys(parameters).filter((key) => RESERVED_KEYS.indexOf(key) === -1),
            elements = objUtils.map(objUtils.subset(parameters, elementNames), (element, name) => {
                return loader.getElement(element, "mson:compound", model, locals, texture, name);
            });

        return elements;
    }

    return {
        getSkeleton(loader) {
            const skeleton: Model = parameters.parent ? loader.getModel(parameters.parent) : {
                name: "__root__",
                locals: {},
                elements: {},
                texture: DEFAULT_TEXTURE,
                scale: 0,

                render() { }
            };

            objUtils.copy(skeleton.locals, parameters.locals ? objUtils.map(parameters.locals, of) : {});
            skeleton.texture = createTexture(parameters.texture, skeleton.texture);

            return skeleton;
        },

        getElements(loader, skeleton) {
            if (parameters.parent) loader.getFile(parameters.parent).getElements(loader, skeleton);

            objUtils.copy(skeleton.elements, loadElements(loader, skeleton));

            return skeleton;
        },

        getModel(loader) {
            const parent = this.getElements(loader, this.getSkeleton(loader));

            parent.render = function render(ctx) {
                Object.values(this.elements).forEach((element) => element.render(ctx));
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

export function createLoader(): Loader {
    const files = new Map<string, FileObject>();

    return {
        addFile(filename, body) {
            files.set(filename, createFile(body));
        },

        getFile(filename) {
            const file = files.get(filename);

            if (!file) throw new Error(`Missing file "${filename}"`);

            return file;
        },

        getElement(body, defaultId, model, locals, texture, name) {
            if (typeof body === "string") return createLink(body, model, name);

            const type = body.type || defaultId;

            if (!ELEMENT_TYPES[type]) return null;

            function createElement(body: any) {
                const element: Element = { name, render: ELEMENT_TYPES[type].render };

                objUtils.copy(element, body);

                return element;
            }

            // ({ loader, name, model, locals, texture, body, createElement });

            const element = ELEMENT_TYPES[type].parse({ loader: this, name, model, locals, texture, body, createElement });

            return element;
        },

        getModel(filename) {
            return this.getFile(filename).getModel(this);
        }
    };
}

function createLink(id: string, model: Model, name: string): Element {
    if (id.indexOf("#") != 0) throw new Error(`Link name should begin with a "#".`);

    id = id.substr(1);

    let rendering: boolean;

    return {
        name,

        render(ctx) {
            if (rendering) throw new Error("Cyclic reference in link");

            rendering = true;
            model.elements[id].render(ctx);
            rendering = false;
        }
    };
}

export function addElementType<T>(type: string, parse: ElementType<T>["parse"], render: ElementType<T>["render"]) {
    ELEMENT_TYPES[type] = { parse, render };
}
