import { Group, Object3D } from "three";
import { createBox, createCone, createPlane, createPlaneQuad, Quad, quads2geometry } from "../3d";
import { isArrayInsideArray } from "../utils";
import { BoxDecoder, CompoundDecoder, ConeDecoder, PlanarDecoder, PlaneDecoder, RawBox, RawCompound, RawCone, RawPlanar, RawPlane, RawSlot, SlotDecoder } from "./decoders";
import { array, of } from "./incomplete";
import { addElementType, createFile } from "./loader";
import { MsonBox, MsonCompound, MsonCone, MsonFace, MsonPlanar, MsonPlane, MsonSlot } from "./types/internals";
import { MsonModel } from "./types/loader";
import { Token } from "./types/utils";
import { clone, copy, createTexture } from "./utils";

export function fixedLength<T>(value: any = [], length: number, fillWith: T): T[] {
    const arr: T[] = Array.isArray(value) ? value : [value];

    if (!Array.isArray(value)) fillWith = value;

    while (arr.length < length) arr.push(fillWith);
    return arr;
}

function isPresent<T>(a: T | null): a is T {
    return a !== null;
}

addElementType<MsonSlot, RawSlot>("mson:slot", {
    decoder: SlotDecoder,

    parse({ loader, rawLocals, texture, body, createElement }) {
        const localTexture = createTexture(body.texture, texture),
            localRawLocals = copy(clone(rawLocals), body.locals || {});

        let newModel: MsonModel;

        if (typeof body.content === "string") {
            newModel = loader.getModel(body.content, localRawLocals, localTexture);
        } else {
            const content = clone(body.content);

            content.locals = copy(localRawLocals, content.locals || {});
            content.texture = createTexture(content.texture, localTexture);

            newModel = createFile(content).getModel(loader);
        }

        const element = createElement({ model: newModel });

        if (body.name) element.name = body.name;

        return element;
    },

    render(createMesh) {
        return this.model.render(createMesh);
    }
});

addElementType<MsonBox, RawBox>("mson:box", {
    decoder: BoxDecoder,

    parse({ locals, texture, body, createElement }) {
        return createElement({
            from: array(fixedLength(body.from, 3, 0))(locals),
            size: array(fixedLength(body.size, 3, 0))(locals),
            texture: createTexture(body.texture, texture),
            stretch: fixedLength(body.stretch, 3, 0),
            mirror: body.mirror
        });
    },

    render(createMesh) {
        const [x, y, z] = this.from,
            [width, height, depth] = this.size,
            { u, v, w, h } = this.texture,
            [stretchX, stretchY, stretchZ] = this.stretch,
            { mirror } = this;

        const mesh = createMesh(createBox(u, v, x, y, z, width, height, depth, stretchX, stretchY, stretchZ, mirror, w, h));

        mesh.userData["intersectable"] = true;
        mesh.name = this.name;

        return mesh;
    }
});

addElementType<MsonCompound, RawCompound>("mson:compound", {
    decoder: CompoundDecoder,

    parse({ loader, name, model, rawLocals, locals, texture, body, createElement }) {
        texture = createTexture(body.texture, texture);

        const element = createElement({
            center: array(fixedLength(body.center, 3, 0))(locals),
            offset: array(fixedLength(body.offset, 3, 0))(locals),
            rotate: array(fixedLength(body.rotate, 3, 0))(locals),
            mirror: fixedLength(body.mirror, 3, false),
            visible: body.visible !== false,
            texture: texture,
            children: body.children ? body.children
                .map((child) => loader.getComponent(child, "mson:compound", model, rawLocals, locals, texture, name))
                .filter(isPresent) : [],
            cubes: body.cubes ? body.cubes
                .map((cube) => loader.getComponent(cube, "mson:box", model, rawLocals, locals, texture, name))
                .filter(isPresent) : []
        });

        if (body.name) element.name = body.name;

        return element;
    },

    render(createMesh) {
        // TODO implement mirror

        const object = new Object3D(),
            group = new Group();

        const [x, y, z] = this.center,
            [rotateX, rotateY, rotateZ] = this.rotate,
            [offsetX, offsetY, offsetZ] = this.offset;

        object.position.set(x, -y, -z);
        object.rotation.set(rotateX, rotateY, rotateZ);
        object.visible = this.visible;
        object.userData["intersectable"] = true;
        object.name = this.name;

        group.position.set(offsetX, -offsetY, -offsetZ);

        this.children.forEach((child) => {
            group.add(child.render(createMesh));
        });

        this.cubes.forEach((cube) => {
            group.add(cube.render(createMesh));
        });

        object.add(group);

        return object;
    }
});

addElementType<MsonPlane, RawPlane>("mson:plane", {
    decoder: PlaneDecoder,

    parse({ locals, texture, body, createElement }) {
        return createElement({
            position: array(fixedLength(body.position, 3, 0))(locals),
            size: array(fixedLength(body.size, 2, 0))(locals),
            texture: createTexture(body.texture, texture),
            mirror: fixedLength(body.mirror, 3, false),
            stretch: fixedLength(body.stretch, 3, 0),
            face: body.face.toUpperCase()
        });
    },

    render(createMesh) {
        const [x, y, z] = this.position,
            [width, height] = this.size,
            { u, v, w, h } = this.texture,
            [mirrorX, mirrorY, mirrorZ] = this.mirror,
            [stretchX, stretchY, stretchZ] = this.stretch,
            { face } = this;

        const object = createMesh(createPlane(face, u, v, x, y, z, width, height, stretchX, stretchY, stretchZ, mirrorX, mirrorY, mirrorZ, w, h));

        object.userData["intersectable"] = true;
        object.name = this.name;

        return object;
    }
});

addElementType<MsonPlanar, RawPlanar>("mson:planar", {
    decoder: PlanarDecoder,

    parse({ locals, texture, body, createElement }) {
        const faces: MsonFace[] = [];

        function createFace(direction: string, element: [number, number, number, number, number, Token?, Token?]): MsonFace {
            return {
                direction: direction.toUpperCase(),
                position: [element[0], element[1], element[2]],
                size: [element[3], element[4]],
                texture: createTexture(element.length > 6 ? [
                    of(element[5] || 0)(locals),
                    of(element[6] || 0)(locals)
                ] : [], texture)
            };
        }

        Object.entries(body.faces).forEach(([direction, face]) => {
            if (isArrayInsideArray(face)) {
                face.forEach((subFace) => {
                    faces.push(createFace(direction, subFace));
                });
            } else faces.push(createFace(direction, face));
        });

        return createElement({
            stretch: fixedLength(body.stretch, 3, 0),
            faces
        });
    },

    render(createMesh) {
        const object = new Object3D(),
            [stretchX, stretchY, stretchZ] = this.stretch;

        const quads: Quad[] = [];

        this.faces.forEach((face) => {
            const [x, y, z] = face.position,
                [width, height] = face.size,
                { u, v, w, h } = face.texture,
                { direction } = face;

            quads.push(createPlaneQuad(direction, u, v, x, y, z, width, height, stretchX, stretchY, stretchZ, false, false, false, w, h));
        });

        object.add(createMesh(quads2geometry(quads)));

        object.userData["intersectable"] = true;
        object.name = this.name;

        return object;
    }
});

addElementType<MsonCone, RawCone>("mson:cone", {
    decoder: ConeDecoder,

    parse({ locals, texture, body, createElement }) {
        return createElement({
            from: array(fixedLength(body.from, 3, 0))(locals),
            size: array(fixedLength(body.size, 3, 0))(locals),
            texture: createTexture(body.texture, texture),
            stretch: fixedLength(body.stretch, 3, 0),
            mirror: body.mirror,
            taper: body.taper
        });
    },

    render(createMesh) {
        const [x, y, z] = this.from,
            [width, height, depth] = this.size,
            { u, v, w, h } = this.texture,
            [stretchX, stretchY, stretchZ] = this.stretch,
            { mirror, taper } = this;

        const object = createMesh(createCone(u, v, x, y, z, width, height, depth, stretchX, stretchY, stretchZ, mirror, w, h, taper));

        object.userData["intersectable"] = true;
        object.name = this.name;

        return object;
    }
});

/* function createVertex(body: any): Vertex {
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
}); */
