import { Pixel, PixelOptions } from "./components/common/Pixel";
import { SkinManager } from "./SkinManager";
import { rgb2hex } from "./utils";

export type PixelType = "SELECT" | "SELECT-MULTIPLE" | "RANGE" | "INPUT";
export type PixelManagerColorHandler = (x: number, y: number, color: string) => void;

export class PixelManager {
    private readonly onColor: PixelManagerColorHandler;

    private readonly pixels = new Set<Pixel<any>>();

    constructor(onColor: PixelManagerColorHandler) {
        this.onColor = onColor;
    }

    public getSelector(name: string) {
        return `#pixel-${name}`;
    }

    public registerPixel(x: number, y: number, name: string, type: PixelType, options: PixelOptions) {
        switch (type) {
            case "SELECT":
            case "SELECT-MULTIPLE": {
                const defaultValue: string[] = [],
                    max = type === "SELECT" ? 1 : 3;

                if (type === "SELECT") {
                    const defaultOption = options.find((option) => option[0] === "------") || options[0];
                    defaultValue.push(defaultOption[1]);
                }

                this.pixels.add(Pixel.createDropdown(this.getSelector(name), x, y, options, max, defaultValue, (_, color) => {
                    this.onColor(x, y, color);
                }));
                break;
            } case "RANGE": {
                const index = options.findIndex((option) => option[0] === "------"),
                    defaultValue = index > -1 ? index : 0;

                this.pixels.add(Pixel.createRange(this.getSelector(name), x, y, options, defaultValue, (_, color) => {
                    this.onColor(x, y, color);
                }));
                break;
            } case "INPUT": {
                this.pixels.add(Pixel.createInput(this.getSelector(name), x, y, "", (_, color) => {
                    this.onColor(x, y, color);
                }));
                break;
            }
        }
    }

    public updatePixels(skinManager: SkinManager) {
        this.pixels.forEach((pixel) => {
            const { x, y } = pixel;
            pixel.setValueByColor(rgb2hex(skinManager.getPixel(x, y)), true);
        });
    }
}
