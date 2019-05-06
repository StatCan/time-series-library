/* eslint-env node */
module.exports = {
    'presets': [
        [
            '@babel/env', {
                'useBuiltIns': 'usage',
                'corejs': 'core-js@2'
            }
        ]
    ],
    'env': {
        'node': {
            'presets': [
                [
                    '@babel/env', {
                        'targets': {'node': 10},
                        'useBuiltIns': 'usage',
                        'corejs': 'core-js@2'
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
