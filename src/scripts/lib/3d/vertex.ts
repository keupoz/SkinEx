export type Vertex = {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
};

export function createVertex(x: number, y: number, z: number, u: number, v: number): Vertex {
    return { x, y, z, u, v };
}

export function remapVertex({ x, y, z }: Vertex, u: number, v: number): Vertex {
    return { x, y, z, u, v };
}
