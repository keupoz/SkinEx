import { Element, Model, TextureBody } from "./loader";

export interface Slot {
    model: Model;
}

export interface Box {
    from: number[];
    size: number[];
    texture: TextureBody;
    stretch: number[];
    mirror?: boolean;
}

export interface Compound {
    center: number[];
    offset: number[];
    rotate: number[];
    mirror: boolean[];
    visible: boolean;
    texture: TextureBody;
    children: Element[];
    cubes: Element[];
}

export interface Plane {
    position: number[];
    size: number[];
    texture: TextureBody;
    mirror: boolean[];
    stretch: number[];
    face: string;
}

export interface Face {
    position: number[];
    size: number[];
    texture: TextureBody;
}

export interface Planar {
    stretch: number[];
    faces: Face[];
}

export interface Cone extends Box {
    taper: number;
}

export interface Vertex {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
}

export interface Quad {
    x: number;
    y: number;
    w: number;
    h: number;
    vertices: Vertex[];
}

export interface Quads {
    u: number;
    v: number;
    quads: Quad[];
}