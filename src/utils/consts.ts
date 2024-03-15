import boxen from 'boxen';
import path from 'path';
import { fileURLToPath } from 'url';

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);

const isDev = process.env.npm_lifecycle_event === 'dev';
export const rootPath = process.cwd();
export const cliPath = path.join(distPath, isDev ? '../src' : '../bin');
export const templatesPath = path.join(cliPath, 'templates');

export const BANNER = [
    '     ____  __________  ____     __   ___    ____  ____',
    '    / __  /____/ __ / / _ / |  / /  /   |  / __ \\/ __ \\ ',
    '   / / / / __/ / /_/ // / | | / /  / /| | / /_/ / /_/ /',
    '  / /_/ / /___/ _, _// /  | |/ /  / ___ |/ ____/ ____/ ',
    ' /_____/_____/_/ |_/___/  |___/  /_/  |_/_/   /_/   ',
].join('\n');

export const ALIAS_MAPPER = {
    atSign: '@',
    tildeSign: '~',
};
