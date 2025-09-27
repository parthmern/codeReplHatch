import AWS from 'aws-sdk';
import "dotenv/config";

export class s3Service {

    s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            endpoint: "https://tor1.digitaloceanspaces.com",
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.S3_ACCESSKEY_ID || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "", 
            },
        });
    }

    async getAllImages(bucket: string, prefix = ""): Promise<string[]> {
        const params: AWS.S3.ListObjectsV2Request = {
            Bucket: bucket,
            Prefix: prefix
        };

        const response = await this.s3.listObjectsV2(params).promise();

        const keys: string[] = [];

        console.log(response)

        response.Contents?.forEach(item => {
            if (item.Key) {
                keys.push(item.Key);
                console.log("File:", item.Key);
            }
        });

        return keys;
    }

}