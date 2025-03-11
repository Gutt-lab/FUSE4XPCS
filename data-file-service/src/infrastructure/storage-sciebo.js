//import axios from 'axios'; // Assuming you use axios for HTTP requests
import { createClient } from "webdav";
import fs from "fs";
import 'dotenv/config';


class StorageSciebo {


    client = createClient(
        process.env.SCIEBO_LINK,
        {
          username: process.env.SCIEBO_USER_NAME,
          password: process.env.SCIEBO_PWD,
        }
      );

    async getFileList() {
        const directoryItems = await this.client.getDirectoryContents(process.env.SCIEBO_DATA_DIR);
        return directoryItems;
    }

    async storeFile(file) {
        const fileExists = await this.isFileExist(file.originalname)
        if (fileExists) {
            return -5; 
        }
        const fileContent = fs.readFileSync(file.path);
        const uploadSuccess = await this.client.putFileContents(String(process.env.SCIEBO_DATA_DIR+"/"+file.originalname), fileContent);
        
        if (!uploadSuccess) return -1;

        fs.unlinkSync(file.path);
        const link = this.client.getFileDownloadLink(file.originalname)
        const file_name = link.slice(link.lastIndexOf("/") + 1)
        return String(process.env.SCIEBO_SHARING_LINK+file_name)
    }

    async deleteFile(fileName) {
        try {
            const fileExists = await this.isFileExist(fileName)
            if (!fileExists) {
                console.log(`File Not Exist: ${fileName}`);
                return -5; 
            }
            await this.client.deleteFile(String(process.env.SCIEBO_DATA_DIR + "/" + fileName));
            return true;
        } catch (error) {
            console.error(`Error deleting file: ${fileName}`, error);
            return false;
        }
    }

    async isFileExist(fileName) {
        try {
            const existingFiles = await this.client.getDirectoryContents(process.env.SCIEBO_DATA_DIR);
            return existingFiles.some(item => item.basename === fileName);
        } catch (error) {
            console.error(`Error checking file existence: ${fileName}`, error);
            return false;
        }
    }


}

export default StorageSciebo; 