
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
            next(error);
        }
    }

    async createDataFile(req, res, next) {
        try {
            console.log(req.body.body)
            const dataFile = await this.dataFileService.create(req.body);
            if (!dataFile) {
                return res.status(404).json({ message: 'Data file not found' });
            }
            res.json(dataFile);
        } catch (error) {
            console.error('Error in getDataFileById:', error);
            next(error);
        }
    }
} 