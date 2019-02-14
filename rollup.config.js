import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import {name} from "./package.json";
import {main} from "./package.json";


export default {
    input: `src/${main}`,
    output: {
        file: `dist/${main}`,
        format: "iife",
        name: "vector_lib"
    },
    plugins: [
        resolve(),
        commonjs(),
        babel()
    ]
};