import { addElementType, createFile, createTexture, objUtils } from "./loader";
import { Box, Compound, Cone, Face, Planar, Plane, Quad, Quads, Slot, Vertex } from "./types/internals";

export function fixedLength<T>(arr: T[] = [], length: number, fillWith: T): T[] {
    while (arr.length < length) arr.push(fillWith);
    return arr;
}

function isPresent<T>(a: T | null): a is T {
    return a !== null;
}

addElementType<Slot>("mson:slot", (loader, body, _, model, defineName, createElement) => {
    const content: any = objUtils.copy({}, body.content);
    content.locals = objUtils.copy(objUtils.copy({}, model.locals), content.locals || {});
    content.texture = createTexture(content.texture);

    const newModel = createElement({ model: createFile(content)(loader) });

    if (body.name) defineName(body.name, newModel.model);

    return newModel;
}, function (_, context) {
    this.model.render(context);
});

addElementType<Box>("mson:box", (loader, body, locals, model, _, createElement) => {
    return createElement({
        from: locals.array(fixedLength(body.from, 3, 0)),
        size: locals.array(fixedLength(body.size, 3, 0)),
        texture: loader.getTexture(body.texture, model.texture),
        stretch: fixedLength(body.stretch, 3, 0),
        mirror: body.mirror
    });
}, function (_, __) {
    // TODO: rendering
});

addElementType<Compound>("mson:compound", (loader, body, locals, model, defineName, createElement) => {
    const element = createElement({
        center: locals.array(fixedLength(body.center, 3, 0)),
        offset: locals.array(fixedLength(body.offset, 3, 0)),
        rotate: locals.array(fixedLength(body.rotate, 3, 0)),
        mirror: fixedLength(body.mirror, 3, false),
        visible: body.visible === true,
        texture: loader.getTexture(body.texture, model.texture),
        children: body.children ? (body.children as any[])
            .map((child) => loader.getElement(child, "mson:compound", model, locals, defineName))
            .filter(isPresent) : [],
        cubes: body.cubes ? (body.cubes as any[])
            .map((cube) => loader.getElement(cube, "mson:box", model, locals, defineName))
            .filter(isPresent) : []
    });

    if (body.name) defineName(body.name, element);

    return element;
}, function (_, context) {
    if (!this.visible) return;

    // TODO: rendering

    this.children.forEach((child) => child.render(this, context));
    this.cubes.forEach((cube) => cube.render(this, context));
});

addElementType<Plane>("mson:plane", (loader, body, locals, model, _, createElement) => {
    return createElement({
        position: locals.array(fixedLength(body.position, 3, 0)),
        size: locals.array(fixedLength(body.size, 2, 0)),
        texture: loader.getTexture(body.texture, model.texture),
        mirror: fixedLength(body.mirror, 3, false),
        stretch: fixedLength(body.stretch, 3, 0),
        face: body.face
    });
}, (_, __) => {
    // TODO: rendering
});

addElementType<Planar>("mson:planar", (loader, body, locals, model, _, createElement) => {
    const directions = "up;down;west;east;north;sound".split(";");

    const faces: Face[] = [];

    function createFace(element: number[]): Face {
        return {
            position: [element[0], element[1], element[2]],
            size: [element[3], element[4]],
            texture: loader.getTexture(element.length > 6 ? [
                locals.get(element[5]),
                locals.get(element[6])
            ] : [], model.texture)
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
}, function (_, __) {
    this.faces.forEach((_) => {
        // TODO: rendering
    });
});

addElementType<Cone>("mson:cone", (loader, body, locals, model, _, createElement) => {
    return createElement({
        from: locals.array(fixedLength(body.from, 3, 0)),
        size: locals.array(fixedLength(body.size, 3, 0)),
        texture: loader.getTexture(body.texture, model.texture),
        stretch: fixedLength(body.stretch, 3, 0),
        mirror: body.mirror,
        taper: body.taper
    });
}, function (_, __) {
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
addElementType<Quads>("mson:quads", (_, body, __, ___, ____, createElement) => {
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
}, function (_, __) {
    this.quads.forEach((_) => {
        // TODO: rendering
    });
});
