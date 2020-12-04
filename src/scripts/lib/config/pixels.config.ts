import { PixelManager } from "../PixelManager";

export function registerPixels(pixelManager: PixelManager) {
    pixelManager.registerPixel(0, 0, "race", "SELECT", [
        ["------", "none"],
        ["f9b131", "earth_pony"],
        ["d19fe4", "unicorn"],
        ["88caf0", "pegasus"],
        ["fef9fc", "alicorn"],
        ["d0cccf", "zebra"],
        ["282b29", "changeling"],
        ["caed5a", "reformed_changeling"],
        ["ae9145", "gryphon"],
        ["d6ddac", "hippogriff"],
        ["fa88af", "kirin"],
        ["eeeeee", "batpony"],
        ["3655dd", "seapony"]
    ]);

    pixelManager.registerPixel(1, 0, "tail-length", "RANGE", [
        ["425844", "stub"],
        ["d19fe4", "quarter"],
        ["534b76", "half"],
        ["8a6b7f", "three_quarters"],
        ["------", "full"]
    ]);

    pixelManager.registerPixel(2, 0, "snout", "SELECT", [
        ["ffffff", "squared"],
        ["------", "round"],
        ["888888", "none"]
    ]);

    pixelManager.registerPixel(3, 0, "body-type", "SELECT", [
        ["534b76", "tall"],
        ["ce3254", "bulky"],
        ["3254ce", "lanky"],
        ["53beff", "yearling"],
        ["ffbe53", "foal"],
        ["------", "normal"]
    ]);

    pixelManager.registerPixel(1, 1, "accessories", "SELECT-MULTIPLE", [
        ["32", "muffin_hat"],
        ["64", "witch_hat"],
        ["c8", "saddle_bags"],
        ["fa", "aj_stetson"]
    ]);

    pixelManager.registerPixel(0, 1, "magic-color", "INPUT", []);
}
