import fs from 'fs-extra';
import { join } from 'path';

type TSConfigJSON = {
    packagePath: string;
    compilerOptions?: {
        types?: string[];
        paths?: Record<string, string[]>;
    };
};

export const configureTSConfigJSON = ({ packagePath, compilerOptions }: TSConfigJSON) => {
    const tsConfigPath = join(packagePath, 'tsconfig.json');
    const tsConfig = fs.readJSONSync(tsConfigPath);

    if (compilerOptions) {
        if (compilerOptions.paths) {
            tsConfig.compilerOptions.paths = compilerOptions.paths;
        }
        if (compilerOptions.types) {
            tsConfig.compilerOptions.types = compilerOptions.types;
        }
    }

    fs.writeJSONSync(tsConfigPath, tsConfig, {
        spaces: 2,
    });
};
