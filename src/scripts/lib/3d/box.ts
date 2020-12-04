import { Direction } from "./direction";
import { createQuad, Quad, quads2geometry } from "./quad";
import { createVertex } from "./vertex";

export function createBox(u: number, v: number, x: number, y: number, z: number, w: number, h: number, d: number, stretchX: number, stretchY: number, stretchZ: number, mirror: boolean, tw: number, th: number) {
    let x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number;

    x1 = x - stretchX;
    y1 = y - stretchY;
    z1 = z - stretchZ;

    x2 = x + w + stretchX;
    y2 = y + h + stretchY;
    z2 = z + d + stretchZ;

    if (mirror) {
        const v = x1;
        x1 = x2;
        x2 = v;
    }

    const vertex1 = createVertex(x1, y1, z1, 0, 0),
        vertex2 = createVertex(x2, y1, z1, 0, 8),
        vertex3 = createVertex(x2, y2, z1, 8, 8),
        vertex4 = createVertex(x1, y2, z1, 8, 0),
        vertex5 = createVertex(x1, y1, z2, 0, 0),
        vertex6 = createVertex(x2, y1, z2, 0, 8),
        vertex7 = createVertex(x2, y2, z2, 8, 8),
        vertex8 = createVertex(x1, y2, z2, 8, 0);

    const u1 = u,
        u2 = u + d,
        u3 = u + d + w,
        u4 = u + d + w + w,
        u5 = u + d + w + d,
        u6 = u + d + w + d + w,
        v1 = v,
        v2 = v + d,
        v3 = v + d + h;

    const quads: Quad[] = [];

    quads[2] = createQuad([vertex6, vertex5, vertex1, vertex2], u2, v1, u3, v2, tw, th, mirror, Direction.DOWN);
    quads[3] = createQuad([vertex3, vertex4, vertex8, vertex7], u3, v2, u4, v1, tw, th, mirror, Direction.UP);
    quads[1] = createQuad([vertex1, vertex5, vertex8, vertex4], u1, v2, u2, v3, tw, th, mirror, Direction.WEST);
    quads[4] = createQuad([vertex2, vertex1, vertex4, vertex3], u2, v2, u3, v3, tw, th, mirror, Direction.NORTH);
    quads[0] = createQuad([vertex6, vertex2, vertex3, vertex7], u3, v2, u5, v3, tw, th, mirror, Direction.EAST);
    quads[5] = createQuad([vertex5, vertex6, vertex7, vertex8], u5, v2, u6, v3, tw, th, mirror, Direction.SOUTH);

    return quads2geometry(quads);
}
