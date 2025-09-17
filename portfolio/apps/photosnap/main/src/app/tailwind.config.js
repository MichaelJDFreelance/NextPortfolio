const plugin = require('tailwindcss/plugin');

module.exports = {
    plugins: [
        plugin(function({ matchUtilities }) {
            matchUtilities(
                {
                    'grid-areas': (value) => ({
                        gridTemplateAreas: value
                            //.replaceAll(',', '\n')
                            .split('|')
                            .map((row) => `"${row}"`.replaceAll(',', ' '))
                            .join(' ')
                        ,
                    }),
                },
                { values: {} }
            );
        }),
        // Additional plugins can be added here
    ],
};
