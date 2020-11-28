import { querySelector } from "@keupoz/strict-queryselector";
import { hex2rgb, rgb2hex } from "../../utils";
import { Color } from "./Color";
import { Dropdown } from "./Dropdown";
import { Range } from "./Range";

export type PixelOptions = [string, string][];
export type PixelMethods<T> = {
    getComponent(updateValue: (value: T) => void): PixelMainComponent<T>;
    getColor(value: T): string;
    getValueByColor(color: string): T;
    onInput(value: T, color: string): void;
};

interface PixelMainComponent<T> {
    setValue(value: T): void;
}

export class Pixel<T>{
    public readonly x: number;
    public readonly y: number;

    private readonly mainComponent: PixelMainComponent<T>;
    private readonly colorComponent: Color;

    private readonly getColor: PixelMethods<T>["getColor"];
    private readonly getValueByColor: PixelMethods<T>["getValueByColor"];

    private color: string;
    private value: T;
    private initialValue: T;

    constructor(selector: string, x: number, y: number, value: T, methods: PixelMethods<T>) {
        const { getComponent, getColor, getValueByColor, onInput } = methods;

        this.x = x;
        this.y = y;

        this.colorComponent = new Color(`${selector} .pixel--color`, "");
        this.mainComponent = getComponent((value) => {
            this.value = value;
            this.updateColor();
            onInput(value, this.color);
        });

        this.getColor = getColor;
        this.getValueByColor = getValueByColor;

        this.color = "";
        this.value = value;
        this.initialValue = value;

        this.updateColor();

        querySelector(`${selector} .pixel--reset`, HTMLButtonElement)
            .addEventListener("click", () => {
                this.reset();
                onInput(this.value, this.color);
            });
    }

    public setValue(value: T, resetDefault = false) {
        this.mainComponent.setValue(value);
        this.value = value;
        this.updateColor();

        if (resetDefault) this.initialValue = value;
    }

    public setValueByColor(color: string, resetDefault = false) {
        return this.setValue(this.getValueByColor(color), resetDefault);
    }

    public updateColor() {
        this.color = this.getColor(this.value);
        this.colorComponent.setValue(this.color);
    }

    public reset() {
        this.setValue(this.initialValue);
    }

    public static createDropdown(selector: string, x: number, y: number, options: PixelOptions, max: number, defaultValue: string[], onInput: PixelMethods<string[]>["onInput"]) {
        if (max === 1 && !defaultValue.length) defaultValue.push(options[0][1]);

        return new Pixel(selector, x, y, defaultValue, {
            getComponent(updateValue) {
                const dropdownOptions = options.map((option) => option[1]);
                return new Dropdown(`${selector} .dropdown`, dropdownOptions, defaultValue, max, updateValue);
            },
            getColor(value) {
                if (!value.length) return "------";

                const color = value
                    .map((value) => {
                        const option = options.find((option) => option[1] === value);
                        return option ? option[0] : "";
                    })
                    .join("")
                    .padStart(6, "0");

                return color;
            },
            getValueByColor(color) {
                if (max === 1) {
                    const option = options.find((option) => option[0] === color);
                    return option ? [option[1]] : defaultValue.slice();
                } else {
                    const rgb = hex2rgb(color).map((c) => c.toString(16).padStart(2, "0"));
                    return options
                        .filter((option) => rgb.includes(option[0]))
                        .map((option) => option[1]);
                }
            },
            onInput
        });
    }

    public static createRange(selector: string, x: number, y: number, options: PixelOptions, defaultValue: number, onInput: PixelMethods<number>["onInput"]) {
        return new Pixel(selector, x, y, defaultValue, {
            getComponent(updateValue) {
                const max = options.length - 1;
                return new Range(`${selector} .range`, defaultValue, updateValue, { max });
            },
            getColor(value) {
                return options[value][0].padStart(6, "0");
            },
            getValueByColor(color) {
                const index = options.findIndex((option) => option[0] === color);
                return index > -1 ? index : defaultValue;
            },
            onInput
        });
    }

    public static createInput(selector: string, x: number, y: number, defaultValue: string, onInput: PixelMethods<string>["onInput"]) {
        return new Pixel(selector, x, y, defaultValue, {
            getComponent(updateValue) {
                const input = querySelector(`${selector} .pixel--input`, HTMLInputElement);

                input.addEventListener("input", () => {
                    const value = input.value.replace(/^#+/, "");

                    if (!value) {
                        updateValue(value);
                        return;
                    }

                    const number = parseInt(value, 16);

                    if (value.length > 6) return;
                    if (isNaN(number)) return;

                    updateValue(number.toString(16));
                });

                return {
                    setValue(value) {
                        input.value = value;
                    }
                };
            },
            getColor(value) {
                value = value.replace(/^#+/, "").padStart(6, "0");
                return value === "000000" ? "------" : value;
            },
            getValueByColor(color) {
                return `#${rgb2hex(hex2rgb(color))}`;
            },
            onInput
        });
    }
}
