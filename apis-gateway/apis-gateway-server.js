import express from 'express';
import 'dotenv/config';
import usersRouter from './routes/users.route.js';

const app = express();
app.use(express.json());

// Routes
app.use(usersRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 