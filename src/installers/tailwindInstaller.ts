import { configurePackageJSON } from '../utils/configurePackageJSON';
import { join } from 'path';
import { copyTemplates } from 'src/utils';

export const tailwindInstaller = (packagePath: string) => {
    configurePackageJSON({
        packagePath,
        dependencies: {
            clsx: '^2.1.0',
            'tailwind-merge': '^2.2.1',
        },
        devDependencies: {
            tailwindcss: '^3.3.5',
            autoprefixer: '^10.4.14',
            postcss: '^8.4.31',
            prettier: '^3.1.0',
            'prettier-plugin-tailwindcss': '^0.5.7',
        },
    });

    copyTemplates(packagePath, 'tailwind');
};
