import { MsonComponent, MsonModel } from "./loader";
import { TextureObject } from "./utils";

export interface MsonSlot {
    model: MsonModel;
}

export interface MsonBox {
    from: number[];
    size: number[];
    texture: TextureObject;
    stretch: number[];
    mirror: boolean;
}

export interface MsonCompound {
    center: number[];
    offset: number[];
    rotate: number[];
    mirror: boolean[];
    visible: boolean;
    texture: TextureObject;
    children: MsonComponent[];
    cubes: MsonComponent[];
}

export interface MsonPlane {
    position: number[];
    size: number[];
    texture: TextureObject;
    mirror: boolean[];
    stretch: number[];
    face: string;
}

export interface MsonFace {
    direction: string;
    position: number[];
    size: number[];
    texture: TextureObject;
}

export interface MsonPlanar {
    stretch: number[];
    faces: MsonFace[];
}

export interface MsonCone extends MsonBox {
    taper: number;
}

export interface MsonVertex {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
}

export interface MsonQuad {
    x: number;
    y: number;
    w: number;
    h: number;
    vertices: MsonVertex[];
}

export interface MsonQuads {
    u: number;
    v: number;
    quads: MsonQuad[];
}
