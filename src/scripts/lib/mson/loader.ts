import { array, of } from "./incomplete";
import { Element, ElementType, Loader, Model, TextureBody, TextureObject } from "./types/loader";

const RESERVED_KEYS = "parent;locals;texture;scale".split(";"),
    DEFAULT_TEXTURE = createTexture([0, 0, 64, 32]);

const ELEMENT_TYPES: Record<string, ElementType<unknown>> = {};

export const objUtils = {
    map<T, K>(obj: Record<string, T>, valueMapper: (value: T) => K) {
        const result: Record<string, K> = {};
        Object.keys(obj).forEach((key) => result[key] = valueMapper(obj[key]));
        return result;
    },

    copy<T>(to: Record<string, T>, from: Record<string, T>) {
        Object.keys(from).forEach((key) => to[key] = from[key]);
        return to;
    },

    subset<T>(obj: Record<string, T>, keys: string[]) {
        const result: typeof obj = {};
        keys.forEach((key) => result[key] = obj[key]);
        return result;
    }
};

export function createTexture(body?: TextureBody, parent?: TextureObject): TextureObject {
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
}

export function createFile(body: any) {
    const parameters = typeof body === "string" ? JSON.parse(body) : body;

    function loadElements(loader: Loader, model: Model) {
        const { locals } = model,
            incoming: Record<string, Element> = {},
            elementNames = Object.keys(parameters).filter((key) => RESERVED_KEYS.indexOf(key) === -1),
            elements = objUtils.map(objUtils.subset(parameters, elementNames), (element) => {
                return loader.getElement(element, "mson:compound", model, {
                    get(input) {
                        return of(input)(locals);
                    },
                    array(input) {
                        return array(input)(locals);
                    },
                    obj(input) {
                        return objUtils.map(input, (value) => typeof value === "string" ? of(value)(locals) : value);
                    }
                }, (name, subElement) => {
                    incoming[name] = subElement;
                });
            });

        return elements;
    }

    return function (loader: Loader) {
        const parent: Model = parameters.parent ? loader.getModel(parameters.parent) : {
            locals: {},
            elements: {},
            texture: DEFAULT_TEXTURE,
            scale: 0,

            render() { }
        };

        objUtils.copy(parent.locals, parameters.locals ? objUtils.map(parameters.locals, of) : {});
        objUtils.copy(parent.elements, loadElements(loader, parent));
        parent.texture = createTexture(parameters.texture, parent.texture);

        parent.render = function render(context) {
            Object.values(this.elements).forEach((element) => element.render(this, context));
        };

        return parent;
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
    const files: Record<string, ReturnType<typeof createFile>> = {};

    return {
        getTexture: createTexture,

        addFile(filename, body) {
            files[filename] = createFile(body);
        },

        getElement(body, defaultId, model, locals, defineName) {
            if (typeof body === "string") return Link(body, model);

            const type = body.type || defaultId;

            if (!ELEMENT_TYPES[type]) return null;

            function createElement<T>(body: T) {
                const element: Element = { render: ELEMENT_TYPES[type].render };

                objUtils.copy(element, body);

                return element;
            }

            const element = ELEMENT_TYPES[type].parse(this, body, locals, model, defineName, createElement);

            return element;
        },

        getModel(filename) {
            if (!files[filename]) throw new Error(`Missing file "${filename}"`);
            return files[filename](this);
        }
    };
}

function Link(id: string, model: Model): Element {
    if (id.indexOf("#") != 0) throw new Error(`Link name should begin with a "#".`);

    id = id.substr(1);

    let rendering: boolean;

    return {
        render(parent, context) {
            if (rendering) throw new Error("Cyclic reference in link");

            rendering = true;
            model.elements[id].render(parent, context);
            rendering = false;
        }
    };
}

export function addElementType<T>(type: string, parse: ElementType<T>["parse"], render: ElementType<T>["render"]) {
    ELEMENT_TYPES[type] = { parse, render };
}
