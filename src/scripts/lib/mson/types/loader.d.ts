import { Decoder } from "@mojotech/json-type-validation";
import { BufferGeometry, Mesh, Object3D } from "three";
import { Locals, RawLocals, TextureObject } from "./utils";

type CreateMesh = (geometry: BufferGeometry) => Mesh;
type RenderMsonComponent<T> = (this: T, createMesh: CreateMesh) => Object3D;

export interface MsonFile {
    getSkeleton(loader: MsonLoader, rawLocals?: RawLocals, texture?: TextureObject): MsonModel;
    getElements(loader: MsonLoader, skeleton: MsonModel): MsonModel;
    getModel(loader: MsonLoader, rawLocals?: RawLocals, texture?: TextureObject): MsonModel;
}

export interface MsonComponent {
    name: string;
    render: RenderMsonComponent<this>;
    [key: string]: any;
}

export interface MsonModel extends MsonComponent {
    rawLocals: RawLocals;
    locals: Locals;
    components: Record<string, MsonComponent>;
    texture: TextureObject;
    scale: number;
}

export interface MsonContext<T, K> {
    loader: MsonLoader;
    name: string;
    model: MsonModel;
    rawLocals: RawLocals;
    locals: Locals;
    texture: TextureObject;
    body: K;
    createElement: (body: T) => T & MsonComponent
}

export interface ComponentType<T, K> {
    decoder: Decoder<K>;
    parse(obj: MsonContext<T, K>): T & MsonComponent;
    render: RenderMsonComponent<T & MsonComponent>;
}

export interface MsonLoader {
    addFile(filename: string, body: any): void;
    getFile(filename: string): MsonFile;
    getComponent(body: any, defaultId: string, model: MsonModel, rawLocals: RawLocals, locals: Locals, texture: TextureObject, name: string): MsonComponent | null;
    getModel(filename: string, rawLocals?: RawLocals, texture?: TextureObject): MsonModel;
}
