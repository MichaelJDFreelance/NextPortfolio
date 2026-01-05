import { defineConfig, mergeConfig } from 'vitest/config';
import { resolve } from 'path';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    test: {
        setupFiles: resolve(__dirname, './src/test/setup.ts'),
    }
}));