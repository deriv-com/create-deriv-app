import fs from 'fs-extra';
import { join } from 'path';

export default function loadTSConfig(packagePath: string) {
    const tsConfigPath = join(packagePath, 'tsconfig.json');

    if (!fs.existsSync(tsConfigPath)) {
        throw new Error('tsconfig.json does not exist within the package folder.');
    }
    const tsConfigJSON = fs.readJSONSync(tsConfigPath);

    return tsConfigJSON;
}
