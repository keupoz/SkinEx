import { DoubleSide, MeshLambertMaterial, NearestFilter, RepeatWrapping, Texture, UVMapping } from "three";

export class Material extends MeshLambertMaterial {
    public readonly map: Texture;

    constructor(canvas: HTMLCanvasElement) {
        super({
            alphaTest: 0.5,
            flatShading: true,
            premultipliedAlpha: true,
            side: DoubleSide,
            transparent: true
        });

        this.map = new Texture(
            canvas,
            UVMapping,
            RepeatWrapping,
            RepeatWrapping,
            NearestFilter,
            NearestFilter
        );

        this.map.premultiplyAlpha = true;
    }

    public update() {
        this.map.needsUpdate = true;
    }
}
