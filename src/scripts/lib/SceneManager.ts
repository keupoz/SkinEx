import { AmbientLight, BoxHelper, DirectionalLight, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from "./OrbitControls";

export type HighlightHandler = (name: string) => void;

export class SceneManager {
    private readonly renderer = new WebGLRenderer({ alpha: true });
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(45, 1, 0.1, 500);
    private readonly controls = new OrbitControls(this.camera, this.renderer.domElement);

    public readonly domElement = this.renderer.domElement;

    private readonly directionalLight = new DirectionalLight(0x7f7f7f);

    private readonly pointer = new Vector2();
    private readonly raycaster = new Raycaster();
    private readonly highlight = new BoxHelper(new Object3D(), 0xffffff);

    private intersect: Object3D | null = null;
    private selected: Object3D | null = null;

    private model: Object3D | null = null;

    private readonly onHighlight: HighlightHandler;

    constructor(onHighlight: HighlightHandler) {
        this.camera.position.set(32, 16, 32);
        this.camera.lookAt(0, 0, 0);

        this.controls.enableKeys = false;
        this.controls.zoomSpeed = 2;
        this.raycaster.params.Line = { threshold: 0 };

        this.onHighlight = onHighlight;

        this.domElement.addEventListener("mousemove", (e) => this.updatePointer(e));
        this.domElement.addEventListener("touchmove", (e) => this.updatePointer(e.changedTouches[0]));
        this.domElement.addEventListener("touchstart", (e) => this.updatePointer(e.changedTouches[0]));

        this.domElement.addEventListener("dblclick", this.updateFocus.bind(this));

        this.controls.addEventListener("change", this.render.bind(this));

        this.scene.add(new AmbientLight(0x808080), this.directionalLight);

        window.addEventListener("resize", this.updateSize.bind(this));
    }

    public setModel(model: Object3D) {
        if (this.model) this.scene.remove(this.model);
        this.scene.add(model);
        this.model = model;
        this.resetFocus();
    }

    public updateSize() {
        const { offsetWidth, offsetHeight } = this.domElement.parentElement || this.domElement;
        this.setSize(offsetWidth, offsetHeight);
    }

    private setSize(width: number, height: number) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.render();
    }

    private updatePointer({ clientX, clientY }: { clientX: number, clientY: number }) {
        const { top, left, width, height } = this.domElement.getBoundingClientRect();

        this.pointer.x = -1 + 2 * (clientX - left) / width;
        this.pointer.y = 1 - 2 * (clientY - top) / height;

        this.updateHighlight();
    }

    private updateHighlight() {
        if (!this.model) return;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects([this.model], true);

        if (!intersects.length) this.intersect = null;
        else {
            let { object } = intersects[0],
                intersectable = !!object.userData["intersectable"];

            while (object.parent && !intersectable) {
                object = object.parent;
                intersectable = !!object.userData["intersectable"];
            }

            if (intersectable) this.intersect = object;
        }

        if (this.intersect) {
            this.highlight.setFromObject(this.intersect).update();
            this.scene.add(this.highlight);
        } else {
            this.scene.remove(this.highlight);
        }

        this.onHighlight(this.intersect?.name || "N/A");
        this.render();
    }

    private resetFocus() {
        this.controls.target.set(0, 0, 0);
        this.directionalLight.target.position.copy(this.controls.target);
        this.selected = null;
        this.controls.update();
        this.updateHighlight();
    }

    private updateFocus() {
        if (!this.intersect && !this.selected) return this.resetFocus();
        if (this.intersect === this.selected) return;

        this.selected = this.intersect;
        this.controls.target.copy(this.highlight.geometry.boundingSphere!.center);
        this.directionalLight.target.position.copy(this.controls.target);
        this.controls.update();
        this.updateHighlight();
    }

    public render() {
        this.directionalLight.position.copy(this.camera.position);
        this.renderer.render(this.scene, this.camera);
    }
}
