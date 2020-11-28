import { querySelector, wrapQuerySelector } from "@keupoz/strict-queryselector";

export type DropdownInputHandler = (selected: string[]) => void;

export class Dropdown {
    private readonly selected: string[] = [];
    private readonly max: number;

    private readonly $values: HTMLElement;
    private readonly $options: HTMLElement;

    private readonly onInput: DropdownInputHandler;

    private readonly elMap = new Map<string, HTMLElement>();

    constructor(selector: string, options: string[], value: string[], max: number, onInput: DropdownInputHandler) {
        const container = querySelector(selector, HTMLElement),
            find = wrapQuerySelector(container);

        this.$values = find(".dropdown--values", HTMLElement);
        this.$options = find(".dropdown--options", HTMLElement);

        this.max = Math.max(1, max);
        this.onInput = onInput;

        this.setOptions(options);
        this.setValue(value);
    }

    private getLabel() {
        if (!this.selected.length) return "";

        if (this.max === 1) {
            const element = this.elMap.get(this.selected[0]);
            return element ? element.innerText : "N/A";
        }

        return `${this.selected.length} selected`;
    }

    public setOptions(options: string[]) {
        this.$options.innerHTML = "";
        this.elMap.clear();

        options.forEach((value) => {
            const element = document.createElement("div");
            element.classList.add("dropdown--option");
            element.innerText = value;

            element.addEventListener("click", () => {
                const oldValue = JSON.stringify(this.selected);

                if (this.selected.includes(value)) {
                    if (this.max > 1) this.unselect(value);
                    else return;
                } else this.select(value);

                const newValue = JSON.stringify(this.selected);

                if (oldValue === newValue) return;

                this.update();
                this.onInput(this.selected.slice());
            });

            this.elMap.set(value, element);
            this.$options.appendChild(element);
        });
    }

    public setValue(value: string[]) {
        this.selected.length = 0;
        this.selected.push(...value);
        this.update();
    }

    public select(value: string) {
        // Our dropdown in single option mode
        // So clear the selected array
        if (this.max <= 1) this.selected.length = 0;

        // In other case it's in multiple option mode
        // And if the limit is reached do nothing
        else if (this.selected.length >= this.max) return;

        // If everything is okay just select the option
        this.selected.push(value);
    }

    public unselect(value: string) {
        const index = this.selected.indexOf(value);

        if (index === -1) return;

        this.selected.splice(index, 1);
    }

    public update() {
        this.elMap.forEach((element, value) => {
            if (this.selected.includes(value)) element.classList.add("selected");
            else element.classList.remove("selected");
        });

        this.$values.innerText = this.getLabel();
    }
}
