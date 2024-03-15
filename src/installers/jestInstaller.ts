import { configurePackageJSON } from '../utils/configurePackageJSON';
import { copyTemplates } from '../utils';

export const jestInstaller = (packagePath: string) => {
    configurePackageJSON({
        packagePath,
        devDependencies: {
            jest: '^29.7.0',
            'jest-environment-jsdom': '^29.7.0',
            'jest-transformer-svg': '^2.0.2',
            '@testing-library/jest-dom': '^6.4.2',
            '@testing-library/react': '^14.2.1',
            '@testing-library/user-event': '^14.5.2',
            '@types/jest': '^29.5.12',
            'identity-obj-proxy': '^3.0.0',
            'ts-jest': '^29.1.2',
        },
    });

    copyTemplates(packagePath, 'jest');
};
