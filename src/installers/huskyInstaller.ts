import { configurePackageJSON } from '../utils/configurePackageJSON';
import { copyTemplates } from '../utils';

export const huskyInstaller = (packagePath: string) => {
    configurePackageJSON({
        packagePath,
        devDependencies: {
            'lint-staged': '^10.4.0',
            husky: '^7.0.0',
            '@commitlint/cli': '^17.1.2',
            '@commitlint/config-conventional': '^17.1.0',
            '@commitlint/config-nx-scopes': '^17.0.0',
        },
        scripts: {
            prepare: 'husky install',
        },
    });

    copyTemplates(packagePath, 'husky');
};
