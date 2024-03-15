import { defineConfig } from 'tsup';
import { execSync } from 'child_process';
import { join } from 'path';
import fs from 'fs-extra';

const copyTemplatesToBin = async () => {
    const templatePath = join(__dirname, 'src/templates');
    fs.copySync(templatePath, './bin/templates', {
        overwrite: true,
    });
    execSync('node bin/index.js');
};
const isDev = process.env.npm_lifecycle_event === 'dev';

export default defineConfig({
    clean: true,
    entry: ['src/index.ts'],
    format: ['esm'],
    minify: !isDev,
    target: 'esnext',
    outDir: 'bin',
    onSuccess: copyTemplatesToBin,
    sourcemap: true,
});
