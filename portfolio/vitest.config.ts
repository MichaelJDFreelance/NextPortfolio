// vitest.config.ts (repo root)
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environmentOptions: {
            jsdom: {
                url: 'http://localhost',
            },
        },
        globals: true,
        environment: 'jsdom',
    },
});