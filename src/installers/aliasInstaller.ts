import loadViteConfig from '../loaders/loadViteConfig';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import fs from 'fs-extra';
import { join } from 'path';
import { ALIAS_MAPPER, configurePackageJSON, configureTSConfigJSON } from 'src/utils';

const capitalizeType = (aliasName: string) => {
    return aliasName.charAt(0).toUpperCase() + aliasName.slice(1, aliasName.length);
};

export const aliasInstaller = async (
    packagePath: string,
    bundler: 'vite' | 'rsbuild',
    aliasType: 'atSign' | 'capitalizeSign' | 'tildeSign',
    aliasNames: string[] = ['components']
) => {
    if (bundler === 'vite') {
        const { ast, aliasPropertyDeclarator, importResolveDeclarator, rootDeclarator } = await loadViteConfig(
            packagePath
        );

        const aliasPropertyDeclaration = aliasPropertyDeclarator(aliasType, aliasNames);

        traverse.default(ast, {
            Program: function (path) {
                path.node.body.splice(0, 0, importResolveDeclarator);
                path.node.body.splice(3, 0, rootDeclarator);
            },
            ObjectExpression: function (path) {
                path.node.properties.push(aliasPropertyDeclaration);
                path.skip();
            },
        });

        const output = generate.default(ast);
        const viteConfigPath = join(packagePath, 'vite.config.ts');

        fs.writeFileSync(viteConfigPath, output.code, 'utf-8');
    }

    configureTSConfigJSON({
        packagePath,
        compilerOptions: {
            paths: Object.fromEntries(
                aliasNames.map(aliasName => [
                    `${
                        aliasType === 'capitalizeSign' ? capitalizeType(aliasName) : ALIAS_MAPPER[aliasType]
                    }/${aliasName}/*`,
                    [`./src/${aliasName}/*`],
                ])
            ),
        },
    });

    configurePackageJSON({
        packagePath,
        devDependencies: {
            '@types/node': '^20.11.10',
        },
    });
};
