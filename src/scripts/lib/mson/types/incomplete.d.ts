export type Tokens = Array<string | number> | string | number;
export type Locals = Record<string, GetLocal>;
export type GetLocal = (locals: Locals) => number;
