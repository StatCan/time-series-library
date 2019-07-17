/* eslint-env node */
module.exports = {
    'presets': [
        [
            '@babel/env', {
                'useBuiltIns': 'usage'
            }
        ]
    ],
    'env': {
        'node': {
            'presets': [
                [
                    '@babel/preset-typescript', {
                        'targets': {'node': 10}
                    }
                ]
            ]
        }
    },
    'plugins': ['@babel/plugin-proposal-object-rest-spread'],
    'ignore': [
        /core-js/,
        /@babel\/runtime/
    ]
};
