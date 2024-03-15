import { join } from 'path';
import { rootPath, templatesPath } from './consts';
import fs from 'fs-extra';

export function copyTemplates(packagePath: string, templateName: string) {
    const templatePath = join(templatesPath, templateName);
    const destinationPath = join(rootPath, packagePath) + '/';
    fs.copySync(templatePath, destinationPath, {
        overwrite: true,
    });

    // gitignore files are being excluded by tarball during npm pack
    if (fs.existsSync(join(destinationPath, 'gitignore'))) {
        fs.renameSync(join(destinationPath, 'gitignore'), join(destinationPath, '.gitignore'));
    }
}
