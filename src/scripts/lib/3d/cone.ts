import { Direction } from "./direction";
import { createQuad, quads2geometry } from "./quad";
import { createVertex } from "./vertex";

export function createCone(u: number, v: number, x: number, y: number, z: number, w: number, h: number, d: number, stretchX: number, stretchY: number, stretchZ: number, mirror: boolean, tw: number, th: number, tipInset: number) {
    let xMin: number, yMin: number, zMin: number,
        xMax: number, yMax: number, zMax: number;

    xMin = x - stretchX;
    yMin = y - stretchY;
    zMin = z - stretchZ;

    xMax = x + w + stretchX;
    yMax = y + h + stretchY;
    zMax = z + d + stretchZ;

    if (mirror) {
        const v = xMax;
        xMax = xMin;
        xMin = v;
    }

    const tipXmin = xMin + w * tipInset,
        tipZmin = zMin + d * tipInset,
        tipXmax = xMax - w * tipInset,
        tipZmax = zMax - d * tipInset;

    // w:west e:east d:down u:up s:south n:north
    const wds = createVertex(tipXmin, yMin, tipZmin, 0, 0),
        eds = createVertex(tipXmax, yMin, tipZmin, 0, 8),
        eus = createVertex(xMax, yMax, zMin, 8, 8),
        wus = createVertex(xMin, yMax, zMin, 8, 0),
        wdn = createVertex(tipXmin, yMin, tipZmax, 0, 0),
        edn = createVertex(tipXmax, yMin, tipZmax, 0, 8),
        eun = createVertex(xMax, yMax, zMax, 8, 8),
        wun = createVertex(xMin, yMax, zMax, 8, 0);

    return quads2geometry([
        createQuad([edn, eds, eus, eun], u + d + w, d, v + d, h, tw, th, mirror, Direction.EAST),
        createQuad([wds, wdn, wun, wus], u, d, v + d, h, tw, th, mirror, Direction.WEST),
        createQuad([edn, wdn, wds, eds], u + d, w, v, d, tw, th, mirror, Direction.DOWN),
        createQuad([eus, wus, wun, eun], u + d + w, w, v + d, -d, tw, th, mirror, Direction.UP),
        createQuad([eds, wds, wus, eus], u + d, w, v + d, h, tw, th, mirror, Direction.NORTH),
        createQuad([wdn, edn, eun, wun], u + d + w + d, w, v + d, h, tw, th, mirror, Direction.SOUTH)
    ]);
}
