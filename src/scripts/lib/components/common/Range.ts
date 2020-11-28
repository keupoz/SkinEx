import { querySelector, wrapQuerySelector } from "@keupoz/strict-queryselector";
import { isPresent } from "../../utils";

export type RangeSettings = {
    min?: number;
    max?: number;
    step?: number;
};

export type RangeInputHandler = (value: number) => void;

export class Range {
    private readonly $track: HTMLElement;
    private readonly $fill: HTMLElement;
    private readonly $thumb: HTMLElement;

    private min = 0;
    private max = 100;
    private step = 1;

    private value = 0;

    private readonly onInput: RangeInputHandler;

    private readonly dragStartBound = this.dragStart.bind(this);
    private readonly dragBound = this.drag.bind(this);
    private readonly dragEndBound = this.dragEnd.bind(this);

    constructor(selector: string, value: number, onInput: RangeInputHandler, settings: RangeSettings = {}) {
        const container = querySelector(selector, HTMLElement),
            find = wrapQuerySelector(container);

        this.$track = find(".range--track", HTMLElement);
        this.$fill = find(".range--fill", HTMLElement);
        this.$thumb = find(".range--thumb", HTMLElement);

        this.setSettings(settings, value);

        this.onInput = onInput;

        this.$track.addEventListener("mousedown", this.dragStartBound);
        this.$track.addEventListener("touchstart", this.dragStartBound);
    }

    private getStep() {
        return this.step;
    }

    private getMin() {
        return this.min;
    }

    private getMax() {
        const step = this.getStep(),
            min = this.getMin(),
            max = this.max;

        return Math.floor((max - min) / step) * step + min;
    }

    public getValue() {
        const step = this.getStep(),
            min = this.getMin(),
            max = this.getMax(),
            value = this.value;

        if (value <= min) return min;
        if (value >= max) return max;

        const normalized = (value - min) / step,
            decimal = Math.floor(normalized),
            fraction = normalized - decimal;

        if (!fraction) return value;
        if (fraction < 0.5) return step * decimal + min;

        return step * (decimal + 1) + min;
    }

    private getRange() {
        const min = this.getMin(),
            max = this.getMax();

        return max - min;
    }

    private getPercentage() {
        const min = this.getMin(),
            value = this.getValue(),
            range = this.getRange();

        return (value - min) / range * 100 + "%";
    }

    public setValue(value: number) {
        this.value = value;
        this.update();
    }

    public setSettings({ min, max, step }: RangeSettings, value?: number) {
        if (isPresent(min)) this.min = min;
        if (isPresent(max)) this.max = max;
        if (isPresent(step)) this.step = step;

        if (isPresent(value)) this.value = value;

        this.update();
    }

    private update() {
        this.$fill.style.setProperty("width", this.getPercentage());
    }

    private dragStart(e: MouseEvent | TouchEvent) {
        if (e.type === "mousedown") {
            document.body.addEventListener("mousemove", this.dragBound);
            document.body.addEventListener("mouseup", this.dragEndBound);
            document.body.addEventListener("mouseleave", this.dragEndBound);
        } else {
            document.body.addEventListener("touchmove", this.dragBound);
            document.body.addEventListener("touchend", this.dragEndBound);
        }

        if (e.target !== this.$thumb) this.drag(e);
    }

    private drag(e: MouseEvent | TouchEvent) {
        const bounds = this.$track.getBoundingClientRect(),
            min = this.getMin(),
            range = this.getRange(),
            oldValue = this.getValue();

        let { clientX: x } = e instanceof TouchEvent ? e.changedTouches[0] : e;

        x -= bounds.left;
        this.value = x / bounds.width * range + min;

        const newValue = this.getValue();

        if (oldValue !== newValue) {
            this.update();
            this.onInput(newValue);
        }
    }

    private dragEnd() {
        document.body.removeEventListener("mousemove", this.dragBound);
        document.body.removeEventListener("touchmove", this.dragBound);
        document.body.removeEventListener("mouseup", this.dragEndBound);
        document.body.removeEventListener("mouseleave", this.dragEndBound);
        document.body.removeEventListener("touchend", this.dragEndBound);
    }
}
