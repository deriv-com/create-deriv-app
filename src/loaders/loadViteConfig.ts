import { parse } from '@babel/parser';
import fs from 'fs-extra';
import { join } from 'path';
import { ALIAS_MAPPER } from '../utils';

const rootDeclarator = {
    type: 'VariableDeclaration',
    declarations: [
        {
            type: 'VariableDeclarator',

            id: {
                type: 'Identifier',
                name: 'root',
            },
            init: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'resolve',
                },
                arguments: [
                    {
                        type: 'Identifier',
                        name: '__dirname',
                    },
                    {
                        type: 'StringLiteral',
                        extra: {
                            rawValue: 'src',
                            raw: '"src"',
                        },
                        value: 'src',
                    },
                ],
            },
        },
    ],
    kind: 'const',
};

const aliasPropertyDeclarator = (aliasType: string, aliasNames: string[]) => ({
    type: 'ObjectProperty',
    method: false,
    key: {
        type: 'Identifier',
        name: 'resolve',
    },
    computed: false,
    shorthand: false,
    value: {
        type: 'ObjectExpression',
        properties: [
            {
                type: 'ObjectProperty',
                method: false,
                key: {
                    type: 'Identifier',
                    name: 'alias',
                },
                computed: false,
                shorthand: false,
                value: {
                    type: 'ObjectExpression',
                    properties: aliasNames.map(aliasName => aliasDeclarator(aliasName, aliasType)),
                },
            },
        ],
    },
});

const importResolveDeclarator = {
    type: 'ImportDeclaration',
    specifiers: [
        {
            type: 'ImportSpecifier',
            imported: {
                type: 'Identifier',
                name: 'resolve',
            },
            importKind: null,
            local: {
                type: 'Identifier',
                name: 'resolve',
            },
        },
    ],
    importKind: 'value',
    source: {
        type: 'StringLiteral',
        extra: {
            rawValue: 'path',
            raw: "'path'",
        },
        value: 'path',
    },
    assertions: [],
};

const capitalizeSign = (aliasName: string) => {
    return aliasName.charAt(0).toUpperCase() + aliasName.slice(1, aliasName.length);
};

const aliasDeclarator = (aliasName: string, aliasType: string) => {
    const aliasSign =
        aliasType === 'atSign' || aliasType === 'tildeSign' ? ALIAS_MAPPER[aliasType] : capitalizeSign(aliasName);

    return {
        type: 'ObjectProperty',
        method: false,
        key: {
            type: 'StringLiteral',
            extra: {
                rawValue: `${aliasSign}/${aliasName}`,
                raw: `"${aliasSign}/${aliasName}"`,
            },
            value: `${aliasSign}/${aliasName}`,
        },
        computed: false,
        shorthand: false,
        value: {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: 'resolve',
            },
            arguments: [
                {
                    type: 'Identifier',
                    name: 'root',
                },
                {
                    type: 'StringLiteral',
                    extra: {
                        rawValue: aliasName,
                        raw: `"${aliasName}"`,
                    },
                    value: aliasName,
                },
            ],
        },
    };
};

export default async function loadViteConfig(packagePath: string) {
    const viteConfigPath = join(packagePath, 'vite.config.ts');

    if (!fs.existsSync(viteConfigPath)) {
        throw new Error('vite.config.ts does not exist within the package folder.');
    }
    const viteConfigRaw = fs.readFileSync(viteConfigPath, 'utf-8');

    const ast = await parse(viteConfigRaw, {
        sourceType: 'module',
        plugins: ['typescript'],
    });

    return {
        aliasPropertyDeclarator,
        importResolveDeclarator,
        rootDeclarator,
        ast,
    };
}
