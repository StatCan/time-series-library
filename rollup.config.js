import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {main} from './package.json';


export default {
    input: `src/${main}`,
    output: {
        file: `dist/${main}`,
        format: 'iife',
        name: 'time_series_library'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel()
    ]
};
