import { CreateTexture } from "./types/utils";

export const RESERVED_KEYS = "parent;locals;texture;scale".split(";"),
    FACE_DIRECTIONS = "up;down;west;east;north;sound".split(";");

export const createTexture: CreateTexture = (body, parent) => {
    if (Array.isArray(body)) {
        return {
            u: first(0, body[0], parent?.u),
            v: first(0, body[1], parent?.v),
            w: first(0, body[2], parent?.w),
            h: first(0, body[3], parent?.h)
        };
    }

    return {
        u: first(0, body?.u, parent?.u),
        v: first(0, body?.v, parent?.v),
        w: first(0, body?.w, parent?.w),
        h: first(0, body?.h, parent?.h)
    };
};

export function map<T, K>(obj: Record<string, T>, valueMapper: (value: T, key: string) => K) {
    const result: Record<string, K> = {};
    Object.entries(obj).forEach(([key, value]) => result[key] = valueMapper(value, key));
    return result;
}

export function copy<T extends Record<string, any>>(target: T, ...sources: T[]): T {
    return Object.assign(target, ...sources);
}

export function clone<T extends Record<string, any>>(obj: T) {
    return Object.assign({} as T, obj);
}

export function subset(obj: Record<string, any>, keys: string[]) {
    const result: typeof obj = {};
    keys.forEach((key) => result[key] = obj[key]);
    return result;
}

export function first<T>(defaultValue: T, ...values: (T | undefined)[]) {
    return values.find((value) => value !== undefined) || defaultValue;
}
