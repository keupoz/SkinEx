import { GetLocal, Locals, Tokens } from "./types/incomplete";

const FUNCS: Record<string, Function> = {
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,
    "*": (a: number, b: number) => a * b,
    "/": (a: number, b: number) => a / b,
    "%": (a: number, b: number) => a % b,
    "^": (a: number, b: number) => a ** b
};
const OPERATIONS = Object.keys(FUNCS).join(", ");

function singleEntrant(func: GetLocal) {
    let circularCheck: boolean;

    return function (locals: Locals) {
        if (circularCheck) throw new Error("Cyclical reference");

        circularCheck = true;
        const result = func(locals);
        circularCheck = false;
        return result;
    };
}

export function of(tokens: Tokens): GetLocal {
    if (Array.isArray(tokens)) {
        if (tokens.length !== 3) {
            throw new Error(`Saw a local of ${tokens.length} members. Expected 3 of (left, op, right).`);
        }

        const operator = tokens[1];

        if (typeof operator === "number") throw new Error("Operation must be a string.");

        const op = FUNCS[operator];

        if (!op) throw new Error(`Invalid operation. Expected one of ${OPERATIONS}.`);

        const left = of(tokens[0]),
            right = of(tokens[2]);

        return (locals: any) => op(left(locals), right(locals));
    }

    if (typeof tokens === "string") {
        const token = tokens.substr(1);
        return singleEntrant((locals) => locals[token](locals));
    }

    if (typeof tokens === "number") {
        return () => tokens;
    }

    throw new Error("Unsupported local type. A local must be either a value (number) string (#variable) or an array");
}

export function array(arr: Array<string | number>) {
    const ofs = arr.map(of);
    return (locals: Locals) => ofs.map((fn) => fn(locals));
}
