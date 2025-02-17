import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createUserLifespinRouter } from './src/infrastructure/http/routes/user.lifespin.route.js';
import { createExperimentLifespinRouter } from "./src/infrastructure/http/routes/experiment.lifespin.route.js";
import { MongoConfig } from "./src/config/mongo.config.js";


dotenv.config();


async function startServer() {
    const app = express();
    console.log(process.env.SERVER_PORT)
    // Middleware
    app.use(cors());
    app.use(json());
    const _db = await MongoConfig.connect()
    // Routes
    app.use('/metadata/users', createUserLifespinRouter(_db));
    app.use('/metadata/experiments', createExperimentLifespinRouter(_db));

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

