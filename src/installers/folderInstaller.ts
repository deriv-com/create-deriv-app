import { copyTemplates } from '../utils';
import { rootPath } from '../utils';
import { join } from 'path';
import fs from 'fs-extra';

export const folderInstaller = (packagePath: string, folders: string[]) => {
    const destinationPath = join(rootPath, packagePath);

    for (let i = 0; i < folders.length; i++) {
        const destinationFolderPath = `${destinationPath}/src/${folders[i]}`;
        if (!fs.existsSync(destinationFolderPath)) {
            fs.mkdirSync(destinationFolderPath);
            try {
                const fd = fs.openSync(`${destinationFolderPath}/index.ts`, 'wx');
                fs.closeSync(fd);
            } catch (err) {
                continue;
            }
        }
    }
};
