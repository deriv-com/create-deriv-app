import * as p from '@clack/prompts';
import { info } from './logger';
import fs from 'fs-extra';
import { rootPath } from './consts';
import path from 'path';

const validateName = (name: string) => {
    if (!name.length) return 'A package name is required';

    const isPackageExists = fs.existsSync(path.join(rootPath, name));
    if (isPackageExists) return `The package folder ${name} already exists`;
    return;
};

export type LibraryDependencies = {
    name: string;
    type: 'library';
    description: string;
    repository?: string;
    organizationName: string;
    repositoryName: string;
    shouldBootstrap: boolean;
};

export type PackageDependencies = {
    name: string;
    type: 'package';
    bundler: 'vite' | 'rsbuild';
    styling: 'sass' | 'tailwind' | 'styledComponents';
    shouldUseReactQuery: boolean;
    derivPackages: ('derivUi' | 'derivUtils' | 'derivIcons')[];
    shouldBootstrap: boolean;
    aliases?: 'atSign' | 'capitalizeSign';
    folders?: string[];
};

type Dependencies = LibraryDependencies | PackageDependencies;

export const promptDependencies = async (): Promise<Dependencies> => {
    const packageName = await p.text({
        message: 'What is the name of the new V2 package?',
        validate: validateName,
    });
    const isLibrary = await p.confirm({
        message: 'Is this for a library?',
        initialValue: false,
    });

    if (isLibrary) {
        const description = await p.text({
            message: 'Provide a short description of the library',
            validate(value) {
                if (value.length === 0) return 'A description is required';
            },
        });
        const organizationName = await p.text({
            message: 'Provide the Github organization name owning this library',
            initialValue: `deriv-com`,
        });
        const repositoryName = await p.text({
            message: `Provide the Github repository name for the library (found at https://github.com/${organizationName.toString()}/<REPOSITORY_NAME>)`,
            validate(value) {
                if (value.length === 0) return 'A repository name is required';
                if (/[A-Z]/.test(value)) return 'Repository name should not contain uppercases';
            },
        });
        const repositoryUrl = `https://github.com/${organizationName}/${packageName.toString()}`;

        const shouldBootstrap = await p.confirm({
            message: 'Should we initialize a Git repository and bootstrap the package?',
            initialValue: true,
        });

        const libraryDependencies: LibraryDependencies = {
            name: packageName.toString(),
            description: description.toString(),
            repository: repositoryUrl.toString(),
            organizationName: organizationName.toString(),
            repositoryName: repositoryName.toString(),
            type: 'library',
            shouldBootstrap: Boolean(shouldBootstrap),
        };

        return libraryDependencies;
    }
    const dependencies = await p.group<PackageDependencies>(
        {
            bundler: () =>
                p.select({
                    message: 'Which bundler would you like to integrate?',
                    options: [
                        { value: 'vite', label: 'Vite' },
                        { value: 'rsbuild', label: 'Rsbuild' },
                    ],
                    initialValue: 'webpack',
                }),
            styling: () =>
                p.select({
                    message: 'Which styling library will you be using?',
                    options: [
                        { value: 'tailwind', label: 'Tailwind', hint: 'includes twMerge and clsx' },
                        { value: 'sass', label: 'Sass', hint: 'includes clsx' },
                        { value: 'styledComponents', label: 'Styled Components' },
                    ],
                    initialValue: 'tailwind',
                }),
            derivPackages: () =>
                p.multiselect({
                    message: 'Which Deriv packages should be included?',
                    options: [
                        { value: 'derivUi', label: '@deriv/ui' },
                        { value: 'derivUtils', label: '@deriv/utils' },
                        { value: 'derivIcons', label: '@deriv/quill-icons' },
                    ],
                }),
        },
        {
            onCancel: () => process.exit(1),
        }
    );

    const shouldConfigureFolders = await p.confirm({
        message: 'Do you want to configure the folder structure?',
        initialValue: true,
    });

    let folders;
    if (shouldConfigureFolders) {
        folders = await p.multiselect({
            message: 'Which folder structures should we bootstrap for you?',
            options: [
                { value: 'components', label: 'components', hint: 'at src/components' },
                { value: 'pages', label: 'pages', hint: 'at src/pages' },
                { value: 'screens', label: 'screens', hint: 'at src/screens' },
                { value: 'hooks', label: 'hooks', hint: 'at src/hooks' },
                { value: 'utils', label: 'utils', hint: 'at src/utils' },
            ],
        });
    }

    let aliases;
    // TODO: Improve this later
    // const shouldConfigureAlias = await p.confirm({
    //     message: 'Do you wish to use path aliases?',
    //     initialValue: true,
    // });
    // if (shouldConfigureAlias) {
    //     aliases = await p.select({
    //         message: 'Which alias type will you be using?',
    //         options: [
    //             { value: 'atSign', label: '@', hint: '@/components/*, @/hooks/*, @/utils/*, @/static/*' },
    //             { value: 'capitalizeSign', label: 'Capitalize', hint: 'Components/*, Hooks/*, Utils/*, Static/*' },
    //         ],
    //         initialValue: 'atSign',
    //     });
    // }

    const shouldBootstrap = await p.confirm({
        message: 'Should we initialize a Git repository and bootstrap the package?',
        initialValue: true,
    });

    const packageDependencies: PackageDependencies = {
        name: packageName.toString(),
        type: 'package',
        ...dependencies,
        shouldBootstrap: Boolean(shouldBootstrap),
        aliases,
        folders,
    };

    return packageDependencies;
};
