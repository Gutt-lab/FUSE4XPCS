import express from 'express';
import 'dotenv/config';
import usersRouter from './routes/users.route.js';
import dataFilesRouter from './routes/data-files.route.js';

const app = express();
app.use(express.json());

// Routes
app.use(usersRouter);
app.use(dataFilesRouter);
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 