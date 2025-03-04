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
        const fileContent = fs.readFileSync(file.path);
        
        const uploadSuccess = await this.client.putFileContents(String(process.env.SCIEBO_DATA_DIR+"/"+file.originalname), fileContent);
        
        if (!uploadSuccess) return -1;

        fs.unlinkSync(file.path);
        const link = this.client.getFileDownloadLink(file.originalname)
        const file_name = link.slice(link.lastIndexOf("/") + 1)
        console.log(`File deleted: ${file.path}`);

        return String(process.env.SCIEBO_SHARING_LINK+file_name)
    }
}

export default StorageSciebo; 