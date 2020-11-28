import { querySelector, wrapQuerySelector } from "@keupoz/strict-queryselector";

export class Loader {
    private readonly $container: HTMLElement;
    private readonly $animation: HTMLElement;
    private readonly $message: HTMLElement;
    private readonly $error: HTMLElement;

    constructor() {
        this.$container = querySelector("#loader", HTMLElement);

        const find = wrapQuerySelector(this.$container);

        this.$animation = find("#loader-animation", HTMLElement);
        this.$message = find("#loader-message", HTMLElement);
        this.$error = find("#loader-error", HTMLElement);
    }

    public showError(message: string) {
        this.$error.innerText = message;

        this.$animation.setAttribute("hidden", "hidden");
        this.$message.setAttribute("hidden", "hidden");
        this.$error.removeAttribute("hidden");
    }

    public destroy() {
        this.$container.remove();
    }
}
