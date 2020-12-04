import { array, boolean, Decoder, dict, intersection, lazy, number, object, optional, string, tuple, union } from "@mojotech/json-type-validation";
import { Expression, RawLocals, TextureBody, Token, Unwrap } from "./types/utils";
import { FACE_DIRECTIONS, RESERVED_KEYS } from "./utils";

const pseudoArray = <T>(decoder: Decoder<T>) => union(decoder, array(decoder)),
    valueOr = <T>(decoder: Decoder<T>, defaultValue: T) => optional(decoder).map((value) => value ?? defaultValue);

export const TextureDecoder: Decoder<TextureBody> = union(
    array(number()),
    object({
        u: optional(number()),
        v: optional(number()),
        w: optional(number()),
        h: optional(number()),
    })
);

const TokenDecoder: Decoder<Token> = union(string(), number()),
    ExpressionDecoder: Decoder<Expression> = lazy(() => union(TokenDecoder, tuple([ExpressionDecoder, string(), ExpressionDecoder]))),
    LocalsDecoder: Decoder<RawLocals> = dict(ExpressionDecoder);

const ComponentDecoder = union(string(), object());

const ModelDecoderInternal = object({
    parent: optional(string()),
    scale: optional(number()),
    texture: optional(TextureDecoder),
    locals: optional(LocalsDecoder),
    components: dict(ComponentDecoder)
});

export type RawModel = Unwrap<typeof ModelDecoder>;
export const ModelDecoder = object().andThen((model) => {
    const components: Record<string, any> = {};

    Object.entries(model).forEach(([key, value]) => {
        if (!RESERVED_KEYS.includes(key)) {
            components[key] = value;
        }
    });

    model.components = components;

    return ModelDecoderInternal;
});

export type RawSlot = Unwrap<typeof SlotDecoder>;
export const SlotDecoder = object({
    implementation: string(),
    content: union(string(), ModelDecoder),
    name: optional(string()),
    texture: optional(TextureDecoder),
    locals: optional(LocalsDecoder)
});

export type RawBox = Unwrap<typeof BoxDecoder>;
export const BoxDecoder = object({
    from: optional(array(TokenDecoder)),
    size: optional(array(TokenDecoder)),
    texture: optional(TextureDecoder),
    stretch: optional(pseudoArray(number())),
    mirror: valueOr(boolean(), false)
});

export type RawCompound = Unwrap<typeof CompoundDecoder>;
export const CompoundDecoder = object({
    center: optional(array(TokenDecoder)),
    offset: optional(array(TokenDecoder)),
    rotate: optional(array(TokenDecoder)),
    mirror: optional(pseudoArray(boolean())),
    visible: valueOr(boolean(), true),
    texture: optional(TextureDecoder),
    name: optional(string()),
    children: optional(array(ComponentDecoder)),
    cubes: optional(array(ComponentDecoder))
});

export type RawPlane = Unwrap<typeof PlaneDecoder>;
export const PlaneDecoder = object({
    position: optional(array(TokenDecoder)),
    size: optional(array(TokenDecoder)),
    texture: optional(TextureDecoder),
    mirror: optional(pseudoArray(boolean())),
    stretch: optional(pseudoArray(number())),
    face: string()
});

// const FaceDecoder = array(number()),
const FaceDecoder = union(
    tuple([number(), number(), number(), number(), number()]),
    tuple([number(), number(), number(), number(), number(), TokenDecoder, TokenDecoder])
);
const FaceSetDecoder = union(FaceDecoder, array(FaceDecoder)),
    PlanarDecoderInternal = intersection(CompoundDecoder, object({
        stretch: optional(pseudoArray(number())),
        faces: dict(FaceSetDecoder)
    }));

export type RawPlanar = Unwrap<typeof PlanarDecoder>;
export const PlanarDecoder = object().andThen((planar) => {
    const faces: Record<string, any> = {};

    FACE_DIRECTIONS.forEach((direction) => {
        if (planar[direction]) faces[direction] = planar[direction];
    });

    planar.faces = faces;

    return PlanarDecoderInternal;
});

export type RawCone = Unwrap<typeof ConeDecoder>;
export const ConeDecoder = intersection(BoxDecoder, object({
    taper: number()
}));

const QuadsVertexDecoder = union(array(number()), object({
    x: optional(number()),
    y: optional(number()),
    z: optional(number()),
    u: optional(number()),
    v: optional(number())
}));

const QuadsFaceDecoder = object({
    x: optional(number()),
    y: optional(number()),
    w: optional(number()),
    h: optional(number()),
    vertices: array(number())
});

export type RawQuads = Unwrap<typeof QuadsDecoder>;
export const QuadsDecoder = object({
    u: number(),
    v: number(),
    vertices: array(QuadsVertexDecoder),
    faces: array(QuadsFaceDecoder)
});
