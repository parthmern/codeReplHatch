import fs from 'fs';
import path from 'path'


export class FileService {

    FileService() {

    }

    getAllDirectories(directoryPath = "/") {
        try {
            const dirents = fs.readdirSync(directoryPath, { withFileTypes: true });

            const folders = dirents
                .filter(dirent => dirent.isDirectory())
                .map(dirent => path.join(directoryPath, dirent.name));

            console.log('Folders found:', folders);
        } catch (err) {
            console.error('Error reading directory:', err);
        }
    }

    getAllFilesAndFolders(directoryPath = "/SQL") {
        try {
            const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

            entries.forEach(entry => {
                const fullPath = path.join(directoryPath, entry.name);
                if (entry.isFile()) {
                    console.log('File:', fullPath);
                } else if (entry.isDirectory()) {
                    console.log('Folder:', fullPath);
                    this.getAllFilesAndFolders(fullPath); // Recursively call for subfolders
                }
            });
        } catch (err) {
            console.error('Error reading directory:', err);
        }

    }

}
