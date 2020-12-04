import { querySelector } from "@keupoz/strict-queryselector";
import { saveAs } from "file-saver";
import { ICCRemover } from "./ICCRemover";
import { SkinUtils } from "./SkinUtils";
import { clamp, createCanvasContext, floorPowerOfTwo, hex2rgb } from "./utils";

export type SkinChangeHandler = () => void;

export class SkinManager {
    private readonly originalCtx: CanvasRenderingContext2D;
    private readonly outputCtx: CanvasRenderingContext2D;
    private readonly pixelsCtx: CanvasRenderingContext2D;
    private readonly onSkinChange: SkinChangeHandler;

    private file: File | null = null;

    private readonly utils: SkinUtils;
    private readonly iccRemover = new ICCRemover();

    constructor(outputSelector: string, onSkinChange: SkinChangeHandler) {
        this.outputCtx = createCanvasContext(querySelector(outputSelector, HTMLCanvasElement));
        this.originalCtx = createCanvasContext();
        this.pixelsCtx = createCanvasContext();

        this.pixelsCtx.canvas.width = 4;
        this.pixelsCtx.canvas.height = 2;
        this.pixelsCtx.imageSmoothingEnabled = false;

        this.utils = new SkinUtils(this.originalCtx);

        this.onSkinChange = onSkinChange;
    }

    public getOriginalSize() {
        const { width, height } = this.originalCtx.canvas;
        return { width, height };
    }

    public getCanvas() {
        return this.outputCtx.canvas;
    }

    public setBlob(blob: Blob, name: string) {
        return this.setFile(new File([blob], name));
    }

    public setFile(file: File) {
        return new Promise<void>((resolve, reject) => {
            file.arrayBuffer().then((arrayBuffer) => {
                const bytes = this.iccRemover.clear(arrayBuffer);

                if (!bytes) return reject("Not PNG file");

                file = new File([new Blob([bytes.buffer])], file.name);

                const img = new Image();
                img.onload = () => {
                    this.file = file;

                    const width = floorPowerOfTwo(clamp(64, 8192, img.width)),
                        height = img.height < img.width ? width / 2 : width;

                    if (width !== img.width || height !== img.height) {
                        console.warn(`Size of image was changed from ${img.width}x${img.height} to ${width}x${height}`);
                    }

                    this.originalCtx.canvas.width = width;
                    this.originalCtx.canvas.height = height;
                    this.originalCtx.imageSmoothingEnabled = false;

                    this.pixelsCtx.clearRect(0, 0, 4, 2);
                    this.originalCtx.clearRect(0, 0, width, height);

                    this.pixelsCtx.drawImage(img, 0, 0);
                    this.originalCtx.drawImage(img, 0, 0, width, height);

                    this.utils.convert();

                    this.updateOutput();
                    this.onSkinChange();
                    URL.revokeObjectURL(img.src);
                    resolve();
                };
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });
        });
    }

    public async reset() {
        if (!this.file) return;
        return await this.setFile(this.file);
    }

    public setSize(size: number) {
        this.updateOutput(size);
    }

    public getPixel(x: number, y: number): [r: number, g: number, b: number] {
        const [r, g, b] = this.pixelsCtx.getImageData(x, y, 1, 1).data;
        return [r, g, b];
    }

    public setPixel(x: number, y: number, hex: string) {
        const [r, g, b] = hex2rgb(hex),
            pixel = new Uint8ClampedArray([r, g, b, r | g | b ? 255 : 0]),
            data = new ImageData(pixel, 1, 1);
        this.pixelsCtx.putImageData(data, x, y);
        this.updatePixels();
    }

    private updatePixels() {
        const s = this.outputCtx.canvas.width / 64;
        this.outputCtx.clearRect(0, 0, 4 * s, 2 * s);
        this.outputCtx.drawImage(this.pixelsCtx.canvas, 0, 0);
    }

    private updateOutput(size?: number) {
        const original = this.originalCtx.canvas;

        if (!size) size = original.width;

        this.outputCtx.canvas.width = size;
        this.outputCtx.canvas.height = size;
        this.outputCtx.imageSmoothingEnabled = false;

        this.outputCtx.drawImage(original, 0, 0, size, size);

        this.updatePixels();
    }

    public saveAs() {
        this.outputCtx.canvas.toBlob((blob) => {
            if (!blob) throw new Error("No blob created");

            const name = this.file ? this.file.name : `SkinEx-${Date.now()}`;
            saveAs(blob, name);
        });
    }
}
