import { querySelector, wrapQuerySelector } from "@keupoz/strict-queryselector";

export type CheckboxInputHandler = (value: boolean) => void;

export class Checkbox {
    private readonly $input: HTMLInputElement;

    constructor(selector: string, value: boolean, onInput: CheckboxInputHandler) {
        const container = querySelector(selector, HTMLElement),
            find = wrapQuerySelector(container);

        this.$input = find("input", HTMLInputElement);

        this.setValue(value);

        this.$input.addEventListener("input", () => {
            onInput(this.getValue());
        });
    }

    public getValue() {
        return this.$input.checked;
    }

    public setValue(checked: boolean) {
        this.$input.checked = checked;
    }
}
