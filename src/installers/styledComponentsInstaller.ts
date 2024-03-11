import { configurePackageJSON } from '../utils/configurePackageJSON';

export const styledComponentsInstaller = (packagePath: string) => {
    configurePackageJSON({
        packagePath,
        dependencies: {
            'styled-components': '^6.1.8',
        },
    });
};
