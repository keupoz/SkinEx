export function isPresent<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export function normalizeWord(word: string) {
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function logOfTwo(value: number) {
    return Math.floor(Math.log(value) / Math.LN2);
}

// https://github.com/mrdoob/three.js/blob/820ad6bac0858d477fe3972ab02aee5a89d31b3c/src/math/MathUtils.js#L151
export function floorPowerOfTwo(value: number) {
    return Math.pow(2, logOfTwo(value));
}

export function clamp(min: number, max: number, value: number) {
    return Math.min(max, Math.max(min, value));
}

export function grayscale(r: number, g: number, b: number) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function hex2rgb(hex: string): [r: number, g: number, b: number] {
    const num = parseInt(hex, 16),
        r = num >> 16,
        g = num >> 8 & 0xff,
        b = num & 0xff;

    return [r, g, b];
}

export function rgb2hex(rgb: [r: number, g: number, b: number]): string {
    return rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
}

export function createCanvasContext(canvas = document.createElement("canvas")) {
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Couldn't get context for canvas");

    return ctx;
}

export function drawTemplatePiece(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, tw: number, th: number, name: string, label: string) {
    const sx = ctx.canvas.width / tw,
        sy = ctx.canvas.height / th;

    x *= sx;
    y *= sy;
    w *= sx;
    h *= sy;

    /** Line width */
    const l = 4;

    ctx.save();

    ctx.fillStyle = "#efefef";
    ctx.lineWidth = l;
    ctx.strokeStyle = "rgba(0,0,0,0.2)";

    ctx.setLineDash([10, 5]);

    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x + l / 2, y + l / 2, w - l, h - l);

    const fh = 2 * sy;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = `${fh}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(normalizeWord(name), x + w / 2, y - fh / 2 + h / 2, w - 2 * l - 2 * sx);
    ctx.fillText(label, x + w / 2, y + fh / 2 + h / 2, w - 2 * l - 2 * sx);

    ctx.restore();
}
