import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import {name} from "./package.json";

export default {
    input: "src/vector_lib.js",
    output: {
        file: `dist/${name}.js`,
        format: "iife"
    },
    plugins: [
        resolve(),
        commonjs(),
        babel()
    ]
};