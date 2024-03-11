import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import fs from 'fs-extra';
import { join } from 'path';

type ReleaseConfig = {
    packagePath: string;
    organizationName: string;
};

export default async function configureReleaseConfig({ packagePath, organizationName }: ReleaseConfig) {
    const releaseConfigPath = join(packagePath, 'release.config.cjs');

    if (!fs.existsSync(releaseConfigPath)) {
        throw new Error('release.config.cjs does not exist within the package folder.');
    }
    const releaseConfigRaw = fs.readFileSync(releaseConfigPath, 'utf-8');

    const ast = await parse(releaseConfigRaw);

    await traverse.default(ast, {
        ObjectProperty: function (path) {
            if (path.node.key?.name === 'repositoryUrl') {
                path.node.value.value = `git@github.com:${organizationName}/${packagePath}.git`;
            }
        },
    });

    const output = await generate.default(ast);

    fs.writeFileSync(releaseConfigPath, output.code, 'utf-8');
}
