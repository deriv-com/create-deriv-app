import { configurePackageJSON, copyTemplates } from '../utils';

export const eslintInstaller = (packagePath: string, isLibrary: boolean) => {
    copyTemplates(packagePath, isLibrary ? 'libraryLinters' : 'linters');

    configurePackageJSON({
        packagePath,
        devDependencies: isLibrary
            ? {
                  '@deriv-com/eslint-config-deriv': '^2.1.0-beta.3',
                  'eslint-plugin-prettier': '^5.0.0',
                  prettier: '^3.1.0',
              }
            : {
                  '@deriv-com/eslint-config-deriv': '^2.1.0-beta.3',
                  'eslint-plugin-prettier': '^5.0.0',
                  stylelint: '^13.13.1',
                  'stylelint-config-prettier': '^8.0.2',
                  'stylelint-formatter-pretty': '^2.1.1',
                  'stylelint-no-unsupported-browser-features': '^4.0.0',
                  'stylelint-selector-bem-pattern': '^2.1.0',
                  prettier: '^3.1.0',
              },

        scripts: {
            'test:lint': 'prettier --log-level silent --write . && eslint "./src/**/*.?(js|jsx|ts|tsx)"',
        },
    });
};
