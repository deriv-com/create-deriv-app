import { configurePackageJSON } from '../utils';

export const sassInstaller = (packagePath: string) => {
    configurePackageJSON({
        packagePath,
        dependencies: {
            clsx: '^2.1.0',
        },
        devDependencies: {
            sass: '^1.70.0',
        },
    });
};
