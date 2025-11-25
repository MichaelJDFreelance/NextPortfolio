export default {
    plugins: [
        function ({ addUtilities }) {
            const values = {
                // You can define any preset values here
                // Or leave this empty and rely on arbitrary values
            };

            const utilities = {};

            for (const [name, value] of Object.entries(values)) {
                utilities[`.grid-areas-${name}`] = {
                    gridTemplateAreas: value
                        .split('|')
                        .map((row) => `"${row}".replaceAll(',', ' ')`)
                        .join(' '),
                };
            }

            addUtilities(utilities);

            // Enable arbitrary values like:
            // class="grid-areas-[header,header|sidebar,main]"
            return {
                matchUtilities: {
                    'grid-areas': (value) => ({
                        gridTemplateAreas: value
                            .split('|')
                            .map((row) => `"${row}".replaceAll(',', ' ')`)
                            .join(' ')
                    }),
                },
            };
        },
    ],
};