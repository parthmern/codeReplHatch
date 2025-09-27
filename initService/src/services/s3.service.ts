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
                    console.log("File:", item.Key);
                }
            });

            return keys;
        } catch (error) {
            console.log("ERROR: s3Service -> getAllObject", error);
            return null;
        }
    }

    async copyS3Folder(folderName: string, projectName: string) {

        const listParams = {
            Bucket: this.bucketName,
            Prefix: folderName + "/"
        };

        const listedObjects = await this.s3Client.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0){
            console.error(`listedObjects.Contents is empty means ${folderName} is empty`);
            return;
        }

        const allFilesInsideFolder = listedObjects.Contents.map((file) => file.Key);

        // first copy folder like "folderName/" and then copy files inside it "folderName/file1"
        await Promise.all(
            allFilesInsideFolder.map(async (file) => {
                if (!file) return;
                const copyFrom = `${this.bucketName}/${file}`;
                const copyTo = file.replace(folderName, projectName);
                const copyParams = {
                    Bucket: this.bucketName,
                    CopySource: copyFrom, 
                    Key: copyTo, 
                };
                try {
                    await this.s3Client.copyObject(copyParams).promise();
                    console.log("Copied from", copyFrom, " -> ", copyParams.Key);
                } catch (err) {
                    console.error("Error copying object -> copyS3Folder:", err);
                }
            })
        );

    }


}