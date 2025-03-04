import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {header, validationResult } from 'express-validator';


import { createUserLifespinRouter } from './src/infrastructure/http/routes/user.lifespin.route.js';
import { createExperimentMetadataRouter } from "./src/infrastructure/http/routes/experiment.metadata.route.js";
import { createSampleMetadataRouter } from './src/infrastructure/http/routes/sample.metadata.route.js';
import { createDatasetInstanceMetadataRouter } from './src/infrastructure/http/routes/datasetInstance.metadata.route.js';
import { createDataFileMetadataRouter } from './src/infrastructure/http/routes/dataFile.metadata.route.js';


import { MongoConfig } from "./src/config/mongo.config.js";
import { MySQLConfig } from './src/config/mysql.config.js';


dotenv.config();

async function startServer() {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(json());
    const _mongo_db = await MongoConfig.connect()
    const _mysql_connection = await MySQLConfig.connectSQL();


    const validateAccess = [
        header('client_id').equals(process.env.CLIENT_ID).withMessage('Invalid client_id'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(403).json({ errors:'Client has no access'});
            }
            next();
        }
    ];
    // Routes
    app.use('/metadata/users',validateAccess, createUserLifespinRouter(_mongo_db));
    app.use('/metadata/experiments/v1', validateAccess, createExperimentMetadataRouter(_mysql_connection , _mongo_db));
    app.use('/metadata/samples/v1', validateAccess, createSampleMetadataRouter(_mysql_connection, _mongo_db));
    app.use('/metadata/datasetInstances/v1', validateAccess, createDatasetInstanceMetadataRouter(_mysql_connection, _mongo_db));
    app.use('/metadata/dataFiles/v1', validateAccess, createDataFileMetadataRouter(_mysql_connection, _mongo_db));
    // Error handling
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
    
    const PORT = process.env.SERVER_PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Metadata server running on port ${PORT}`);
    });
}

startServer().catch(console.error);

