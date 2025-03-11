import express from 'express';
import FileService from './src/application/fileService.js';
import bodyParser from 'body-parser';
import {header, validationResult } from 'express-validator';

const app = express();
const port = process.env.SERVER_PORT || 3000;
// Middleware to handle file uploads
app.use(express.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

// Initialize the file service
const fileService = new FileService();

const validateAccess = [
    header('client_id').equals(process.env.CLIENT_ID).withMessage('Invalid client_id'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ errors: errors.array() });
        }
        next();
    }
];


app.get('/files/getlist', async (req, res) => {
    try {
        const result = await fileService.getFilesList("sciebo");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

app.get('/files/file/isexist/:filename',validateAccess, async (req, res) => {
    try {
        const fileName  =  req.params.filename;
        if (!fileName) {
            return res.status(400).json({ message: 'File nmae is required' });
        }

        const result = await fileService.isFileExist(fileName);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});


app.post('/upload',validateAccess,fileService.upload.single('file') ,async (req, res) => {

    try {
        const result = await fileService.uploadFile(req.file);
        if (result == -1) {
            return res.json(result); 
        }
        if (result == -5) {
            return res.json(result); 
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.delete('/delete/:filename', async (req, res) => {
    try {
        const fileName = req.params.filename
        if(!fileName) return res.status(400).json('File name is required'); 
        const isDeleted =  await fileService.deleteFile(fileName);
        if(isDeleted == -5)return res.status(400).json('File not Exist'); 
        if(isDeleted)return res.status(200).json('File is deleted'); 
        return res.status(500).json('Something wrong happened');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

})

// Start the server
app.listen(port, () => {
    console.log(`Service running on http://localhost:${port}`);
}); 