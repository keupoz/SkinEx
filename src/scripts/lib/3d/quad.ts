import { BufferAttribute, BufferGeometry, Vector3 } from "three";
import { remapVertex, Vertex } from "./vertex";

export type VertexTuple = [Vertex, Vertex, Vertex, Vertex];
export type Quad = {
    vertices: VertexTuple;
    direction: Vector3;
};

export function createQuad(vertices: VertexTuple, u1: number, v1: number, u2: number, v2: number, w: number, h: number, mirror: boolean, direction: Vector3): Quad {
    direction = direction.clone();

    vertices[0] = remapVertex(vertices[0], u2 / w, v1 / h);
    vertices[1] = remapVertex(vertices[1], u1 / w, v1 / h);
    vertices[2] = remapVertex(vertices[2], u1 / w, v2 / h);
    vertices[3] = remapVertex(vertices[3], u2 / w, v2 / h);

    if (mirror) {
        const n = vertices.length;

        for (let o = 0; o < n / 2; o++) {
            const vertex = vertices[o],
                i = n - 1 - o;

            vertices[o] = vertices[i];
            vertices[i] = vertex;
        }

        direction.x *= -1;
    }

    return { vertices, direction };
}

export function quads2geometry(quads: Quad[]) {
    const geometry = new BufferGeometry(),
        position: number[] = [],
        normal: number[] = [],
        uv: number[] = [],
        index: number[] = [];

    let i = 0;

    quads.forEach((quad) => {
        const { x: nx, y: ny, z: nz } = quad.direction;

        quad.vertices.forEach((vertex) => {
            const { x, y, z, u, v } = vertex;
            position.push(x, -y, -z);
            normal.push(nx, -ny, -nz);
            uv.push(u, 1 - v);
        });

        const a = i,
            b = i + 1,
            c = i + 2,
            d = i + 3;

        index.push(a, b, d);
        index.push(b, c, d);

        i += quad.vertices.length;
    });

    geometry.setAttribute("position", new BufferAttribute(new Float32Array(position), 3));
    geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normal), 3));
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
    geometry.setIndex(index);

    return geometry;
}
