import AWS from 'aws-sdk';

class StorageS3AWS{
    constructor() {
        this.s3 = new AWS.S3({
            accessKeyId: 'YOUR_ACCESS_KEY_ID', // Replace with your access key
            secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // Replace with your secret key
            region: 'YOUR_REGION' // Replace with your region
        });
    }

    async store(file) {
        const newFileName = `s3_${Date.now()}_${file.name}`;
        const params = {
            Bucket: 'YOUR_BUCKET_NAME', // Replace with your bucket name
            Key: newFileName, // Use the new file name as the key
            Body: file.data, // The file data
            ContentType: file.type // The content type of the file
        };

        try {
            const response = await this.s3.upload(params).promise();
            return { message: 'File stored in S3', data: response.Location };
        } catch (error) {
            throw new Error('Failed to store file in S3: ' + error.message);
        }
    }

    async getFileList() {
        const params = {
            Bucket: 'YOUR_BUCKET_NAME', // Replace with your bucket name
        };

        try {
            const response = await this.s3.listObjectsV2(params).promise();
            return { message: 'File list retrieved from S3', data: response.Contents };
        } catch (error) {
            throw new Error('Failed to retrieve file list from S3: ' + error.message);
        }
    }
}

export default StorageS3AWS; 