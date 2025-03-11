import { getErrorDetailsByName } from "../../../enums/errorCodes.js";
export class DataFileMetadataController {
    constructor(dataFileService) {
        this.dataFileService = dataFileService;
    }

    async getAllDataFiles(req, res, next) {
        try {
            const dataFiles = await this.dataFileService.findAll();
            res.json(dataFiles);
        } catch (error) {
            console.error('Error in getAllDataFiles:', error);
            next(error);
        }
    }

    async getAllDataFilesByUserId(req, res, next) {
        try {
            const userId = req.params.id;
            const dataFiles = await this.dataFileService.findByUserId(userId);
            res.json(dataFiles);
        } catch (error) {
            console.error('Error in getAllDataFilesByUserId:', error);
            next(error);
        }
    }

    async getDataFileById(req, res, next) {
        try {
            const id = req.params.id;
            const dataFile = await this.dataFileService.findById(id);
            if (!dataFile) {
                return res.status(404).json({ message: 'Data file not found' });
            }
            res.json(dataFile);
        } catch (error) {

            console.error('Error in getDataFileById:', error);
            res.json(error);
        }
    }

    async createDataFile(req, res, next) {
        try {
            const dataFile = await this.dataFileService.create(req.body);
            if (!dataFile) {
                return res.status(404).json({ message: 'Data file not found' });
            }
            res.json(dataFile);
        } catch (error) {

            console.error('Error in getDataFileById:', error.message);
            next(error);
        }
    }

    async deleteDataFileById(req, res) {
        const dataFileId  = req.params.id;
        const userID = req.params.user_id
        try {
            const result = await this.dataFileService.delete(dataFileId, userID);
            res.status(200).json(result);
        } catch (error) {
            const e = getErrorDetailsByName(error.message)
            res.status(e.statusCode).json({ error: e.message });
        }
    }


    async fileExists(req, res) {
        const dataFileId = req.params.id;
        const dataFileName = req.params.filename;
        try {
            const exists = await this.dataFileService.fileExists(dataFileName, dataFileId);
            res.json(exists);
        } catch (error) {
            console.error('Error in fileExists:', error);
            res.json(error);
        }
    }
    
} 