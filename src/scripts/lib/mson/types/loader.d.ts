import { Locals } from "./incomplete";

export type RenderContext = CanvasRenderingContext2D;

export type TextureObject = {
    u: number;
    v: number;
    w: number;
    h: number;
};
export type TextureArray = number[];
export type TextureBody = TextureArray | Partial<TextureObject>;
export type CreateTexture = (body?: TextureBody, parent?: TextureObject) => TextureObject;

export type Local = string | number;

type RenderElement<T> = (this: T, context: RenderContext) => void;

export interface FileObject {
    getSkeleton(loader: Loader): Model;
    getElements(loader: Loader, skeleton: Model): Model;
    getModel(loader: Loader): Model;
}

export interface Element {
    name: string;
    render: RenderElement<this>;
    [key: string]: any;
}

export interface Model extends Element {
    locals: Locals;
    elements: Record<string, Element>;
    texture: TextureObject;
    scale: number;
}

export interface ParseObject<T> {
    loader: Loader;
    name: string;
    model: Model;
    locals: Locals;
    texture: TextureObject;
    body: any;
    createElement: (body: T) => T & Element
}

export interface ElementType<T> {
    parse(obj: ParseObject<T>): T & Element;
    render: RenderElement<T & Element>;
}

export interface Loader {
    addFile(filename: string, body: any): void;
    getFile(filename: string): FileObject;
    getElement(body: any, defaultId: string, model: Model, locals: Locals, texture: TextureObject, name: string): Element | null;
    getModel(filename: string): Model;
}
