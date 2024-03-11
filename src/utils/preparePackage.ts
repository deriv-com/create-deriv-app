import { exec } from 'child_process';
import util from 'util';
import { spinner } from '@clack/prompts';
import { LibraryDependencies, PackageDependencies } from './promptDependencies';

const asyncExec = util.promisify(exec);

export async function preparePackage(packagePath: string, dependencies: LibraryDependencies | PackageDependencies) {
    const s = spinner();
    try {
        s.start('Initializing Git repository');
        await asyncExec(`cd ${packagePath} && git init`);
        if (dependencies.type === 'library')
            await asyncExec(
                `git remote add upstream git@github.com:${dependencies.organizationName}/${dependencies.repositoryName}.git`
            );
        s.message('Bootstrapping dependencies (this might take some time 😛)');
        await asyncExec(`cd ${packagePath} && npm install`);
        s.message('Preparing precommit hooks');
        await asyncExec(`cd ${packagePath} && npm run prepare`);
        if (dependencies.type === 'library') {
            s.message('Setting up development branch for pre-release');
            await asyncExec('git checkout -b development');
        }
        s.stop();
    } catch (err) {
        console.log(err);
        s.stop('There was an error in bootstrapping the package');
    }
}
