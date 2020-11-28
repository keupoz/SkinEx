import { querySelector } from "@keupoz/strict-queryselector";
import Clipboard from "clipboard";
import { grayscale, hex2rgb } from "../../utils";

export class Color {
    private readonly $element: HTMLElement;

    constructor(selector: string, value: string) {
        this.$element = querySelector(selector, HTMLElement);
        this.setValue(value);

        new Clipboard(this.$element, { target: (trigger) => trigger })
            .on("success", (e) => {
                const copyText = e.trigger.getAttribute("data-copytext") || "Click to copy";
                e.trigger.setAttribute("data-copytext", "Copied!");
                setTimeout(() => e.trigger.setAttribute("data-copytext", copyText), 1500);
            })
            .on("error", (e) => {
                const copyText = e.trigger.getAttribute("data-copytext") || "Click to copy";
                e.trigger.setAttribute("data-copytext", "Failed to copy");
                setTimeout(() => e.trigger.setAttribute("data-copytext", copyText), 1500);
            });
    }

    public setValue(value: string) {
        const [r, g, b] = hex2rgb(value),
            dark = grayscale(r, g, b) < 127.5;

        this.$element.innerText = value;
        this.$element.style.backgroundColor = value === "------" ? "#323232" : `#${value}`;
        this.$element.style.color = dark ? "white" : "black";
    }
}
