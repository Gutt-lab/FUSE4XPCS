import StorageSciebo from '../infrastructure/storage-sciebo.js';
import StorageS3AWS from '../infrastructure/storages3-aws.js';
import multer from "multer";

class FileService {
    constructor() {
        this.storageSciebo = new StorageSciebo();
        this.StorageS3AWS = new StorageS3AWS();
    }
    upload = multer({ dest: "uploads/" });
    async getFilesList(storageName) {
        if (storageName=="sciebo") { 
            return await this.storageSciebo.getFileList();
        } else {
            return await this.StorageS3AWS.getFileList();
        } 
    }

    async uploadFile(file) {
         // Store files in "uploads/" directory
        // Logic to determine which storage provider to use
        return await this.storageSciebo.storeFile(file);

        if (file.size < 1000000) { // Example condition
        } else {
            return await this.StorageS3AWS.store(file);
        }
    }

    async deleteFile(fileName) {

        return await this.storageSciebo.deleteFile(fileName);

        if (storageName === "sciebo") {
        } else {
            return await this.StorageS3AWS.deleteFile(fileName);
        }
    }

    async isFileExist(fileName) {

        return await this.storageSciebo.isFileExist(fileName);

        if (storageName === "sciebo") {
        } else {
            return await this.StorageS3AWS.deleteFile(fileName);
        }
    }
}

export default FileService; 