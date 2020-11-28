import { drawTemplatePiece } from "../utils";
import { array, of } from "./incomplete";
import { addElementType, createFile, createTexture, objUtils } from "./loader";
import { Box, Compound, Cone, Face, Planar, Plane, Quad, Quads, Slot, Vertex } from "./types/internals";

export function fixedLength<T>(arr: T[] = [], length: number, fillWith: T): T[] {
    while (arr.length < length) arr.push(fillWith);
    return arr;
}

function isPresent<T>(a: T | null): a is T {
    return a !== null;
}

addElementType<Slot>("mson:slot", ({ loader, locals, body, createElement }) => {
    const content: any = objUtils.copy({}, body.content);
    content.locals = objUtils.copy(objUtils.copy({}, locals), content.locals || {});
    content.texture = createTexture(content.texture);

    const newModel = createElement({ model: createFile(content).getModel(loader) });

    return newModel;
}, function render(ctx) {
    this.model.render(ctx);
});

addElementType<Box>("mson:box", ({ locals, texture, body, createElement }) => {
    return createElement({
        from: array(fixedLength(body.from, 3, 0))(locals),
        size: array(fixedLength(body.size, 3, 0))(locals),
        texture: createTexture(body.texture, texture),
        stretch: fixedLength(body.stretch, 3, 0),
        mirror: body.mirror
    });
}, function (ctx) {
    if (this.name === "cape") return;

    const [sw, sh, sd] = this.size,
        { u, v, w, h } = this.texture;

    console.log("Box", { u, v, w, h });

    drawTemplatePiece(ctx, u + sd, v, sw, sd, w, h, this.name, "Top");
    drawTemplatePiece(ctx, u + sd + sw, v, sw, sd, w, h, this.name, "Bottom");
    drawTemplatePiece(ctx, u, v + sd, sd, sh, w, h, this.name, "Right");
    drawTemplatePiece(ctx, u + sd, v + sd, sw, sh, w, h, this.name, "Front");
    drawTemplatePiece(ctx, u + sd + sw, v + sd, sw, sh, w, h, this.name, "Back");
    drawTemplatePiece(ctx, u + sd + 2 * sw, v + sd, sd, sh, w, h, this.name, "Left");

});

addElementType<Compound>("mson:compound", ({ loader, name, model, locals, texture, body, createElement }) => {
    texture = createTexture(body.texture, texture);

    const element = createElement({
        center: array(fixedLength(body.center, 3, 0))(locals),
        offset: array(fixedLength(body.offset, 3, 0))(locals),
        rotate: array(fixedLength(body.rotate, 3, 0))(locals),
        mirror: fixedLength(body.mirror, 3, false),
        visible: body.visible !== false,
        texture: texture,
        children: body.children ? (body.children as any[])
            .map((child) => loader.getElement(child, "mson:compound", model, locals, texture, name))
            .filter(isPresent) : [],
        cubes: body.cubes ? (body.cubes as any[])
            .map((cube) => loader.getElement(cube, "mson:box", model, locals, texture, name))
            .filter(isPresent) : []
    });

    if (body.name) element.name = body.name;

    return element;
}, function render(ctx) {
    if (!this.visible) return;

    this.children.forEach((child) => child.render(ctx));
    this.cubes.forEach((cube) => cube.render(ctx));
});

addElementType<Plane>("mson:plane", ({ locals, texture, body, createElement }) => {
    return createElement({
        position: array(fixedLength(body.position, 3, 0))(locals),
        size: array(fixedLength(body.size, 2, 0))(locals),
        texture: createTexture(body.texture, texture),
        mirror: fixedLength(body.mirror, 3, false),
        stretch: fixedLength(body.stretch, 3, 0),
        face: body.face
    });
}, function render(_) {
    // TODO: rendering
});

addElementType<Planar>("mson:planar", ({ locals, texture, body, createElement }) => {
    const directions = "up;down;west;east;north;sound".split(";");

    const faces: Face[] = [];

    function createFace(element: number[]): Face {
        return {
            position: [element[0], element[1], element[2]],
            size: [element[3], element[4]],
            texture: createTexture(element.length > 6 ? [
                of(element[5])(locals),
                of(element[6])(locals)
            ] : [], texture)
        };
    }

    directions.forEach(face => {
        if (body[face] && body[face].length) {
            const set: number[][] = body[face][0].length ? body[face] : [body[face]];
            faces.concat(set.map(i => createFace(i)));
        }
    });

    return createElement({
        stretch: fixedLength(body.stretch, 3, 0),
        faces
    });
}, function render(_) {
    this.faces.forEach((_) => {
        // TODO: rendering
    });
});

addElementType<Cone>("mson:cone", ({ locals, texture, body, createElement }) => {
    return createElement({
        from: array(fixedLength(body.from, 3, 0))(locals),
        size: array(fixedLength(body.size, 3, 0))(locals),
        texture: createTexture(body.texture, texture),
        stretch: fixedLength(body.stretch, 3, 0),
        mirror: body.mirror,
        taper: body.taper
    });
}, function render(_) {
    // TODO: rendering
});

function createVertex(body: any): Vertex {
    if (Array.isArray(body)) {
        return {
            x: body[0] || 0,
            y: body[1] || 0,
            z: body[2] || 0,
            u: body[3] || 0,
            v: body[4] || 0
        };
    }

    return {
        x: body.x || 0,
        y: body.y || 0,
        z: body.z || 0,
        u: body.u || 0,
        v: body.v || 0
    };
}

addElementType<Quads>("mson:quads", ({ body, createElement }) => {
    const vertices = (body.vertices as any[]).map((vertex) => createVertex(vertex)),
        quads = (body.faces as any[]).map((quad): Quad => {
            return {
                x: quad.x || 0,
                y: quad.y || 0,
                w: quad.w || 0,
                h: quad.h || 0,
                vertices: (quad.vertices as any[]).map(index => vertices[index])
            };
        });

    return createElement({
        u: body.u || 0,
        v: body.v || 0,
        quads
    });
}, function render(_) {
    this.quads.forEach((_) => {
        // TODO: rendering
    });
});
