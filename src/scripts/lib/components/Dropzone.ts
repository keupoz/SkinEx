import { querySelector, wrapQuerySelector } from "@keupoz/strict-queryselector";

export class Dropzone {
    private readonly $container: HTMLElement;
    private readonly $label: HTMLElement;
    private readonly $error: HTMLElement;

    constructor() {
        this.$container = querySelector("#dropzone", HTMLElement);

        const find = wrapQuerySelector(this.$container);

        this.$label = find("#dropzone-label", HTMLElement);
        this.$error = find("#dropzone-error", HTMLElement);
    }

    public show() {
        this.$container.removeAttribute("hidden");
        this.setError(false);
    }

    public close() {
        this.$container.setAttribute("hidden", "hidden");
    }

    public setError(state: boolean) {
        if (state) {
            this.$label.setAttribute("hidden", "hidden");
            this.$error.removeAttribute("hidden");
        } else {
            this.$label.removeAttribute("hidden");
            this.$error.setAttribute("hidden", "hidden");
        }
    }
}
