import { Locals } from "./incomplete";

export type TextureObject = {
    u: number;
    v: number;
    w: number;
    h: number;
};
export type TextureArray = number[];
export type TextureBody = TextureArray | Partial<TextureObject>;
export type CreateTexture = (body?: TextureBody, parent?: TextureObject) => TextureObject;

export type DefineName = (name: string, element: Element) => void;

export type Local = string | number;

export interface LocalsMethods {
    get(input: Local): number;
    array(input: Local[]): number[];
    obj(input: Record<string, Local>): Record<string, number>;
}

export interface Element {
    render<T>(parent: Element, context: T): void;
    [key: string]: any;
}

export interface Model {
    locals: Locals;
    elements: Record<string, Element>;
    texture: TextureObject;
    scale: number;

    render<T>(context: T): void;
}

export interface ElementType<T> {
    parse(loader: Loader, body: any, locals: LocalsMethods, model: Model, defineName: DefineName, createElement: (body: T) => T & Element): Element;
    render<K>(this: T & Element, parent: Element, context: K): void;
}

export interface Loader {
    getTexture: CreateTexture;
    addFile(filename: string, body: any): void;
    getElement(body: any, defaultId: string, model: Model, locals: LocalsMethods, defineName: DefineName): Element | null;
    getModel(filename: string): Model;
}
