import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import bs from "browser-sync";
import del from "del";
import glob from "glob";
import { dest, lastRun, parallel, series, src, task, watch } from "gulp";
import gulpIf from "gulp-if";
import pug from "gulp-pug";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import { rollup, RollupCache } from "rollup";
import { terser } from "rollup-plugin-terser";
import SASS from "sass";
import { initIcons } from "./FontAwesome";

let isProduction = process.env.NODE_ENV === "production";

const FontAwesomeFonts = [
    require.resolve("@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2"),
    require.resolve("@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2")
];

(sass as any).compiler = SASS;

const getIcon = initIcons();

task("clean", () => {
    return del("dist");
});

task("assets", () => {
    return src(["assets/**"].concat(FontAwesomeFonts), {
        since: lastRun("assets"),
        ignore: ["**/_*", "**/sources/**", "assets"]
    })
        .pipe(dest("dist/assets"));
});

task("pug", () => {
    return src("src/templates/pages/**/*.pug")
        .pipe(pug({
            cache: true,
            pretty: !isProduction,

            locals: {
                icon: getIcon
            }
        }))
        .pipe(dest("dist"));
});

task("sass", () => {
    return src(["src/styles/**/*.scss", "!**/_*"])
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(sass({
            outputStyle: isProduction ? "compressed" : "expanded"
        }))
        .pipe(gulpIf(!isProduction, sourcemaps.write()))
        .pipe(dest("dist/styles"));
});

let rollupCache: RollupCache;

task("typescript", async () => {
    const bundle = await rollup({
        input: glob.sync("src/scripts/*.ts"),
        cache: rollupCache,
        plugins: [
            nodeResolve(),
            commonjs({
                transformMixedEsModules: true
            }),
            typescript(),
            json()
        ].concat(isProduction ? [terser()] : [])
    });

    if (bundle.cache) rollupCache = bundle.cache;

    await bundle.write({
        dir: "dist/scripts",
        format: "iife",
        sourcemap: !isProduction
    });
});

task("build:init", (done) => {
    process.env.NODE_ENV = "production";
    isProduction = true;

    done();
});

task("dev:init", (done) => {
    process.env.NODE_ENV = "development";
    isProduction = false;

    done();
});

task("serve", () => {
    watch("assets/**", task("assets"));
    watch("src/templates/**", task("pug"));
    watch("src/styles/**", task("sass"));
    watch("src/scripts/**", task("typescript"));

    bs.init({
        server: "dist",
        watch: true
    });
});

const common = parallel("assets", "pug", "sass", "typescript");

export const build = series("build:init", "clean", common);
export const dev = series("dev:init", "clean", common, "serve");
