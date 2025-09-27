import AWS from 'aws-sdk';
import { error } from 'console';
import "dotenv/config";

export class s3Service {

    s3Client: AWS.S3;
    bucketName: string;

    constructor() {
        this.s3Client = new AWS.S3({
            endpoint: process.env.S3_ENDPOINT || "https://tor1.digitaloceanspaces.com",
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.S3_ACCESSKEY_ID || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
            },
        });
        this.bucketName = process.env.S3_BUCKET_NAME || "parthmern-s3";
    }

    async getAllObject() {
        try {
            const params: AWS.S3.ListObjectsV2Request = {
                Bucket: this.bucketName,
            };

            const response = await this.s3Client.listObjectsV2(params).promise();

            const keys: string[] = [];
            response.Contents?.forEach(item => {
                if (item.Key) {
                    keys.push(item.Key);
                    if (item.Key.endsWith("/")) {  // if object ends with "/" means that is folder ex. "folderName/"
                        console.log("folder:", item.Key);
                    } else {
                        console.log("file: ", item.Key);
                    }

                }
            });

            return keys;
        } catch (error) {
            console.log("ERROR: s3Service > getAllObject", error);
            return null;
        }
    }

    async copyS3Folder(folderName: string, projectName: string) {

        const defaultFolder = folderName + "DEFAULT";
        const listParams = {
            Bucket: this.bucketName,
            Prefix: defaultFolder + "/"
        };

        const listedObjects = await this.s3Client.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.error(`listedObjects.Contents is empty means ${folderName} is empty`);
            return;
        }

        const allFilesInsideFolder = listedObjects.Contents.map((file) => file.Key);

        // first copy folder like "folderName/" and then copy files inside it "folderName/file1"
        await Promise.all(
            allFilesInsideFolder.map(async (object) => {
                // object can be folder like "folderName/"
                // and file "folderName/file"
                if (!object) return;
                const copyFrom = `${this.bucketName}/${object}`;
                const copyTo = object.replace(defaultFolder, projectName);
                const copyParams = {
                    Bucket: this.bucketName,
                    CopySource: copyFrom,
                    Key: copyTo,
                };
                try {
                    await this.s3Client.copyObject(copyParams).promise();
                    console.log("Copied from", copyFrom, " -> ", copyParams.Key);
                    return copyParams.Key;
                } catch (err) {
                    console.error("Error copying object -> copyS3Folder:", err);
                }
            })
        );

    }

    async saveContentToS3(folderName: string, filePath: string, content: string) {
        const params = {
            Bucket: this.bucketName ?? "",
            Key: `${folderName}${filePath}`,
            Body: content
        }
        try {
            const res = await this.s3Client.putObject(params).promise();
            console.log(`Saved at ${folderName}${filePath} `, res);
        }
        catch (error) {
            console.log("ERROR: s3Service > saveContentToS3", error);
        }
    }

}