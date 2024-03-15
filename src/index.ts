#!/usr/bin/env node

import {
    derivInstaller,
    rsbuildInstaller,
    sassInstaller,
    tsupInstaller,
    styledComponentsInstaller,
    tailwindInstaller,
    viteInstaller,
} from './installers';
import {
    BANNER,
    initializePackageFolder,
    promptDependencies,
    info,
    preparePackage,
    LibraryDependencies,
    PackageDependencies,
} from './utils';
import gradient from 'gradient-string';
import chalk from 'chalk';
import boxen from 'boxen';
import { folderInstaller } from './installers/folderInstaller';
import { error } from './utils';

const printCommands = (packageName: string, dependencies: LibraryDependencies | PackageDependencies) => {
    const listCommands = (commands: string[]) => commands.map(command => chalk.bold('➜') + `  ${command}`).join('\n');
    const bootstrapCmds = listCommands(['git init', 'npm install', 'npm run prepare']);

    info(chalk.bold(`Navigate to ${packageName} folder and run the following commands:`));
    info(
        boxen(chalk.bold('➜') + `  cd ${packageName}\n` + (!dependencies.shouldBootstrap ? bootstrapCmds : ''), {
            padding: 2,
            borderStyle: 'none',
        })
    );

    info(chalk.bold('To start the development server:'));
    info(
        boxen(chalk.bold('➜') + '  npm run dev', {
            padding: 2,
            borderStyle: 'none',
        })
    );

    if (dependencies.type === 'library') {
        info(chalk.bold('To commit and publish for a pre-release version (e.g. 1.0.0-development.1):'));
        info(
            boxen(
                listCommands([
                    'git checkout -b development',
                    'git add .',
                    'git commit -m "feat: initialized repository for library"',
                    'git push upstream development',
                ]),
                {
                    padding: 2,
                    borderStyle: 'none',
                }
            )
        );
    }
};

const main = async () => {
    const derivGradient = gradient('#b62020', '#fe8181');
    console.log(derivGradient.multiline(BANNER));
    console.log('\n');
    const dependencies = await promptDependencies();
    const packageName = String(dependencies.name);

    initializePackageFolder(packageName);

    if (dependencies.type === 'library') {
        tsupInstaller(packageName, dependencies);
        if (dependencies.shouldBootstrap) await preparePackage(packageName, dependencies);
        printCommands(packageName, dependencies);

        return;
    }

    switch (dependencies.bundler) {
        case 'vite':
            viteInstaller(packageName);
            break;
        case 'rsbuild':
            rsbuildInstaller(packageName);
            break;
        default:
            break;
    }

    switch (dependencies.styling) {
        case 'tailwind':
            tailwindInstaller(packageName);
            break;
        case 'sass':
            sassInstaller(packageName);
            break;
        case 'styledComponents':
            styledComponentsInstaller(packageName);
            break;
        default:
            break;
    }

    if (dependencies.derivPackages.length) {
        derivInstaller(packageName, dependencies.derivPackages);
    }

    if (dependencies.folders) {
        folderInstaller(packageName, dependencies.folders);
    }

    // TODO: Improve this later
    // if (dependencies.aliases) {
    //     await aliasInstaller(packageName, dependencies.bundler, dependencies.aliases, dependencies.folders);
    // }

    if (dependencies.shouldBootstrap) await preparePackage(packageName, dependencies);

    printCommands(packageName, dependencies);
};

main().catch(err => {
    error('Aborting installation...');
    if (err instanceof Error) {
        error(err.message);
    } else {
        error('An unknown error has occurred:');
        console.log(err);
    }
    process.exit(1);
});
