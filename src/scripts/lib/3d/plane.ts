import { Direction } from "./direction";
import { createQuad, Quad, quads2geometry } from "./quad";
import { createVertex } from "./vertex";

// https://github.com/MineLittlePony/Mson/blob/20b5fc787f7942f8e06ad1d501f63ee47d50690d/src/main/java/com/minelittlepony/mson/api/model/QuadsBuilder.java#L62
export function createPlaneQuad(face: string, u: number, v: number, x: number, y: number, z: number, w0: number, h0: number, stretchX: number, stretchY: number, stretchZ: number, mirrorX: boolean, mirrorY: boolean, mirrorZ: boolean, tw: number, th: number) {
    let w: number, h: number, d: number;

    switch (face) {
        case "EAST": case "WEST": w = 0; h = h0; d = w0; break;
        case "UP": case "DOWN": default: w = w0; h = 0; d = h0; break;
        case "SOUTH": case "NORTH": w = w0; h = h0; d = 0; break;
    }

    let x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number;

    x1 = x - stretchX;
    y1 = y - stretchY;
    z1 = z - stretchZ;

    x2 = x + w + stretchX;
    y2 = y + h + stretchY;
    z2 = z + d + stretchZ;

    if (mirrorX) {
        const v = x1;
        x1 = x2;
        x2 = v;
    }

    if (mirrorY) {
        const v = y1;
        y1 = y2;
        y2 = v;
    }

    if (mirrorZ) {
        const v = z1;
        z1 = z2;
        z2 = v;
    }

    // w:west e:east d:down u:up s:south n:north
    const wds = createVertex(x1, y1, z1, 0, 0),
        eds = createVertex(x2, y1, z1, 0, 8),
        eus = createVertex(x2, y2, z1, 8, 8),
        wus = createVertex(x1, y2, z1, 8, 0),
        wdn = createVertex(x1, y1, z2, 0, 0),
        edn = createVertex(x2, y1, z2, 0, 8),
        eun = createVertex(x2, y2, z2, 8, 8),
        wun = createVertex(x1, y2, z2, 8, 0);

    const mirror = mirrorX || mirrorY || mirrorZ;

    let quad: Quad;

    /* switch (face) {
        case "EAST": quad = createQuad([edn, eds, eus, eun], u, v, d, h, tw, th, mirror, Direction.EAST); break;
        case "WEST": quad = createQuad([wds, wdn, wun, wus], u, v, d, h, tw, th, mirror, Direction.WEST); break;
        case "UP": quad = createQuad([eus, wus, wun, eun], u, v, w, d, tw, th, mirror, Direction.UP); break;
        case "DOWN": quad = createQuad([edn, wdn, wds, eds], u, v, w, d, tw, th, mirror, Direction.DOWN); break;
        case "SOUTH": quad = createQuad([wdn, edn, eun, wun], u, v, w, h, tw, th, mirror, Direction.SOUTH); break;
        case "NORTH": default: quad = createQuad([eds, wds, wus, eus], u, v, w, h, tw, th, mirror, Direction.NORTH); break;
    } */
    switch (face) {
        case "EAST": quad = createQuad([edn, eds, eus, eun], u, v, w0, h0, tw, th, mirror, Direction.EAST); break;
        case "WEST": quad = createQuad([wds, wdn, wun, wus], u, v, w0, h0, tw, th, mirror, Direction.WEST); break;
        case "UP": default: quad = createQuad([eus, wus, wun, eun], u, v, w0, h0, tw, th, mirror, Direction.UP); break;
        case "DOWN": quad = createQuad([edn, wdn, wds, eds], u, v, w0, h0, tw, th, mirror, Direction.DOWN); break;
        case "SOUTH": quad = createQuad([wdn, edn, eun, wun], u, v, w0, h0, tw, th, mirror, Direction.SOUTH); break;
        case "NORTH": quad = createQuad([eds, wds, wus, eus], u, v, w0, h0, tw, th, mirror, Direction.NORTH); break;
    }

    return quad;
}

export function createPlane(face: string, u: number, v: number, x: number, y: number, z: number, w: number, h: number, stretchX: number, stretchY: number, stretchZ: number, mirrorX: boolean, mirrorY: boolean, mirrorZ: boolean, tw: number, th: number) {
    const quad = createPlaneQuad(face, u, v, x, y, z, w, h, stretchX, stretchY, stretchZ, mirrorX, mirrorY, mirrorZ, tw, th);
    return quads2geometry([quad]);
}
