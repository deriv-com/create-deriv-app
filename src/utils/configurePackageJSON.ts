import fs from 'fs-extra';
import { join } from 'path';

type PackageJSONConfig = {
    packagePath: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    name?: string;
    description?: string;
    repositoryUrl?: string;
    scripts?: Record<string, string>;
};

export const configurePackageJSON = ({
    packagePath,
    dependencies,
    devDependencies,
    scripts,
    name,
    description,
    repositoryUrl,
}: PackageJSONConfig) => {
    const packageJsonPath = join(packagePath, 'package.json');
    const packageJSON = fs.readJSONSync(packageJsonPath);

    if (dependencies) {
        for (const [dependency, version] of Object.entries(dependencies)) {
            packageJSON.dependencies[dependency] = version;
        }
    }

    if (devDependencies) {
        for (const [devDependency, version] of Object.entries(devDependencies)) {
            packageJSON.devDependencies[devDependency] = version;
        }
    }

    if (scripts) {
        Object.keys(scripts).forEach(command => (packageJSON.scripts[command] = scripts[command]));
    }

    if (name) packageJSON.name = name;
    if (description) packageJSON.description = description;
    if (repositoryUrl) {
        packageJSON.repository = {
            url: repositoryUrl,
        };
        packageJSON.homepage = `${repositoryUrl}#readme`;
        packageJSON.bugs = {
            url: `${repositoryUrl}/issues`,
        };
    }

    fs.writeJSONSync(packageJsonPath, packageJSON, {
        spaces: 2,
    });
};
