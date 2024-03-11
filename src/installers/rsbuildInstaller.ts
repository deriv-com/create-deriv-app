import { eslintInstaller } from './eslintInstaller';
import { huskyInstaller } from './huskyInstaller';
import { configurePackageJSON, copyTemplates } from 'src/utils';
import { jestInstaller } from './jestInstaller';

export const rsbuildInstaller = (packagePath: string) => {
    copyTemplates(packagePath, 'rsbuild');
    copyTemplates(packagePath, 'actions');

    eslintInstaller(packagePath, false);
    huskyInstaller(packagePath);
    jestInstaller(packagePath);
    configurePackageJSON({
        packagePath,
        name: packagePath,
    });
};
