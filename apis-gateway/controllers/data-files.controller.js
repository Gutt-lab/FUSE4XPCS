import multer from "multer";
import axios from 'axios';
import FormData from 'form-data';


export const upload = multer({ storage: multer.memoryStorage() });

export const uploadSingleFile = async (req, res) => {
    try {
        if (!req.body.data_file_owner_id || !req.body.data_file_name) {
            return res.status(400).json({ message: 'Not enough metadata' });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const response = await axios.post(
            `${process.env.DATAFILES_SERVICE_BASE_URL}/upload`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    client_id: process.env.CLIENT_ID
                }
            }
        );
        if (response.data == -1) {
            res.status(response.status).json('Uploading failed');
        }
        // Respond with the other server's response
        const file_PID = response.data
        console.log(file_PID)

        const metadataResponse = await axios.post(
            `${process.env.METADATA_SERVICE_BASE_URL}/metadata/dataFiles/v1/dataFile/create`, 
            {
                data_file_name: req.body.data_file_name,
                data_file_owner_id: req.body.data_file_owner_id,
                data_file_linked_dataset_instance_id: req.body.data_file_linked_dataset_instance_id,
                data_file_linked_experiment_id: req.body.data_file_linked_experiment_id,
                data_file_pid: file_PID,
            },
            {
                headers: {
                    client_id: process.env.CLIENT_ID
                }
            }

        )
        res.status(response.status).json(metadataResponse.data);

    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
};



