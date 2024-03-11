import { configurePackageJSON } from '../utils/configurePackageJSON';

const derivVersions = {
    derivUi: {
        dependency: '@deriv-com/ui',
        version: 'latest',
    },
    derivUtils: {
        dependency: '@deriv-com/utils',
        version: 'latest',
    },
    derivIcons: {
        dependency: '@deriv/quill-icons',
        version: 'latest',
    },
};

export const derivInstaller = (packagePath: string, derivPackages: string[]) => {
    let derivDependencies = {};
    for (let i = 0; i < derivPackages.length; i++) {
        const derivDependency = derivVersions[derivPackages[i]];
        derivDependencies[derivDependency.dependency] = derivDependency.version;
    }
    configurePackageJSON({
        packagePath,
        dependencies: derivDependencies,
    });
};
