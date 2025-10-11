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

    fetchEverything = async (dir: string): Promise<string[]> => {
        const ignoreContentFolders = ["node_modules"]; // folders whose content we ignore

        return new Promise((resolve, reject) => {
            fs.readdir(dir, { withFileTypes: true }, async (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const results: string[] = [];

                    for (const file of files) {
                        const fullPath = path.join(dir, file.name);

                        if (file.isDirectory()) {
                            if (ignoreContentFolders.includes(file.name)) {
                                results.push(fullPath);
                                continue;
                            }

                            const subFiles = await this.fetchEverything(fullPath);
                            results.push(...subFiles);
                        } else {
                            results.push(fullPath);
                        }
                    }

                    resolve(results);
                } catch (e) {
                    reject(e);
                }
            });
        });
    };



    fetchFileContent = (file: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }

    writeInFile = (file: string, data: string): Promise<void> => {
        console.log("writing in file===>", file, data.slice(0, 20))
        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, 'utf8', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

}
