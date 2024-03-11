import { LibraryDependencies, configurePackageJSON, copyTemplates } from 'src/utils';
import { eslintInstaller } from './eslintInstaller';
import { huskyInstaller } from './huskyInstaller';
import configureReleaseConfig from '../utils/configureReleaseConfig';

export const tsupInstaller = (packagePath: string, libraryDependencies: LibraryDependencies) => {
    copyTemplates(packagePath, 'tsup');

    eslintInstaller(packagePath, true);
    huskyInstaller(packagePath);

    configureReleaseConfig({
        packagePath,
        organizationName: libraryDependencies.organizationName,
    });

    configurePackageJSON({
        packagePath,
        name: libraryDependencies.name,
        description: libraryDependencies.description,
        repositoryUrl: libraryDependencies.repository,
        devDependencies: {
            '@semantic-release/changelog': '^6.0.3',
            '@semantic-release/github': '^9.2.6',
            '@semantic-release/npm': '^11.0.3',
            '@semantic-release/release-notes-generator': '^12.1.0',
        },
    });
};
