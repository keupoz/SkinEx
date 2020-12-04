import { createCanvasContext } from "./utils";

export class SkinUtils {
    private readonly ctx: CanvasRenderingContext2D;
    private scale = 0;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.updateScale();
    }

    private updateScale() {
        this.scale = this.ctx.canvas.width / 64;
    }

    private getPixel(x: number, y: number) {
        return this.ctx.getImageData(x, y, 1, 1).data.slice(0, 3).join(",");
    }

    private isLegacy() {
        if (this.getPixel(0, 0) === "0,0,0") return false;

        const s = this.scale;

        for (let x = 4 * s; x < 8 * s; x++)
            for (let y = 0; y < 8 * s; y++)
                if (this.getPixel(x, y) !== "0,0,0") return false;

        return true;
    }

    public getType() {
        const { width, height } = this.ctx.canvas;

        if (width === height) return "square";
        else if (this.isLegacy()) return "legacy";
        else return "rect";
    }

    private clear(x: number, y: number, w: number, h: number) {
        const s = this.scale;
        this.ctx.clearRect(x * s, y * s, w * s, h * s);
    }

    private draw(img: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
        const s = this.scale;
        this.ctx.drawImage(img, sx * s, sy * s, sw * s, sh * s, dx * s, dy * s, dw * s, dh * s);
    }

    private translate(x: number, y: number) {
        const s = this.scale;
        this.ctx.translate(x * s, y * s);
    }

    private convertLegacy(img: CanvasImageSource) {
        // Clear areas
        this.clear(1, 3, 2, 1); // horn top & bottom
        this.clear(0, 4, 4, 4); // horn other sides
        this.clear(4, 0, 4, 8); // cutiemark
        this.clear(56, 0, 8, 8); // stomach
        this.clear(0, 16, 12, 4); // neck and hooves top & bottom
        this.clear(0, 20, 16, 12); // hooves other sides
        this.clear(36, 16, 8, 4); // butt
        this.clear(32, 20, 8, 12); // back

        // Horn
        this.draw(img, 57, 0, 2, 1, 1, 3, 2, 1); // top & bottom
        this.draw(img, 56, 1, 4, 4, 0, 4, 4, 4); // other sides

        // Cutiemark
        this.draw(img, 0, 20, 4, 8, 4, 0, 4, 8);

        // Neck
        this.draw(img, 24, 0, 4, 4, 0, 16, 4, 4);

        // Back hooves
        this.draw(img, 44, 16, 8, 4, 4, 16, 8, 4); // top & bottom
        this.draw(img, 40, 20, 16, 12, 0, 20, 16, 12); // other sides

        // Stomach and butt
        this.ctx.save();
        this.translate(56, 8);
        this.ctx.scale(1, -1);
        this.draw(img, 24, 0, 8, 8, 0, 0, 8, 8); // Stomach
        this.draw(img, 24, 0, 8, 4, -20, -12, 8, 4); // Butt
        this.ctx.restore();

        // Back
        this.ctx.save();
        this.translate(40, 32);
        this.ctx.rotate(Math.PI);
        this.draw(img, 24, 0, 8, 4, 0, 0, 8, 4);
        this.draw(img, 24, 0, 8, 8, 0, 4, 8, 8);
        this.ctx.restore();
    }

    private convertRect(img: CanvasImageSource, mirror = true) {
        // Clear areas
        // Left back hoof
        this.clear(20, 48, 8, 4); // top & bottom
        this.clear(16, 52, 16, 12); // other sides

        // Left foreleg
        this.clear(36, 48, 8, 4); // top & bottom
        this.clear(32, 52, 16, 12); // outside

        // Left wing
        this.clear(58, 32, 4, 2); // top & bottom
        this.clear(56, 34, 8, 14); // others

        if (mirror) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            // Left back hoof
            this.draw(img, 4, 16, 4, 4, -20, 48, -4, 4); // top
            this.draw(img, 8, 16, 4, 4, -24, 48, -4, 4); // bottom
            this.draw(img, 0, 20, 4, 12, -24, 52, -4, 12); // outside
            this.draw(img, 4, 20, 4, 12, -20, 52, -4, 12); // front
            this.draw(img, 8, 20, 4, 12, -16, 52, -4, 12); // inside
            this.draw(img, 12, 20, 4, 12, -28, 52, -4, 12); // back

            // Left front hoof
            this.draw(img, 44, 16, 4, 4, -36, 48, -4, 4); // top
            this.draw(img, 48, 16, 4, 4, -40, 48, -4, 4); // bottom
            this.draw(img, 40, 20, 4, 12, -40, 52, -4, 12); // outside
            this.draw(img, 44, 20, 4, 12, -36, 52, -4, 12); // front
            this.draw(img, 48, 20, 4, 12, -32, 52, -4, 12); // inside
            this.draw(img, 52, 20, 4, 12, -44, 52, -4, 12); // back

            // Left wing
            this.draw(img, 58, 16, 2, 2, -58, 32, -2, 2); // top
            this.draw(img, 60, 16, 2, 2, -60, 32, -2, 2); // bottom
            this.draw(img, 56, 18, 2, 14, -60, 34, -2, 14); // outside
            this.draw(img, 58, 18, 2, 14, -58, 34, -2, 14); // front
            this.draw(img, 60, 18, 2, 14, -56, 34, -2, 14); // inside
            this.draw(img, 62, 18, 2, 14, -62, 34, -2, 14); // back
            this.ctx.restore();
        } else {
            // Left back hoof
            this.draw(img, 4, 16, 8, 4, 20, 48, 8, 4); // top & bottom
            this.draw(img, 0, 20, 16, 12, 16, 52, 16, 12); // other sides

            // Left front hoof
            this.draw(img, 44, 16, 8, 4, 36, 48, 8, 4); // top & bottom
            this.draw(img, 40, 20, 16, 12, 32, 52, 16, 12); // outside

            // Left wing
            this.draw(img, 58, 16, 4, 2, 58, 32, 4, 2); // top & bottom
            this.draw(img, 56, 18, 8, 14, 56, 34, 8, 14); // other sides
        }
    }

    public convert() {
        this.updateScale();

        const type = this.getType();

        if (type === "square") return;

        const copy = createCanvasContext(),
            original = this.ctx.canvas;

        copy.canvas.width = original.width;
        copy.canvas.height = original.height;
        copy.drawImage(original, 0, 0);

        if (type === "legacy") {
            this.convertLegacy(copy.canvas);
            copy.drawImage(original, 0, 0);
        }

        original.height = original.width;
        this.ctx.drawImage(copy.canvas, 0, 0);
        this.convertRect(copy.canvas);
    }
}
