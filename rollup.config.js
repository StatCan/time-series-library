import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';
import {name} from './package.json';

export default {
    input: `module/${name}.js`,
    output: {
        exports: 'named',
        file: `dist/${name}.js`,
        format: 'iife',
        name: 'TimeSeriesLibrary'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({runtimeHelpers: true}),
        uglify()
    ]
};
