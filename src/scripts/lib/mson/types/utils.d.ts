import { Decoder } from "@mojotech/json-type-validation";

export type Unwrap<T> = T extends Decoder<infer R> ? R : T;

export type TextureObject = {
    u: number;
    v: number;
    w: number;
    h: number;
};

export type TextureArray = number[];
export type TextureBody = TextureArray | Partial<TextureObject>;
export type CreateTexture = (body?: TextureBody, parent?: TextureObject) => TextureObject;

export type Token = string | number;
export type Expression = Token | [Expression, string, Expression];
export type RawLocals = Record<string, Expression>;

export type ResolveLocal = (locals: Locals) => number;
export type Locals = Record<string, ResolveLocal>;
