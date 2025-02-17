require('dotenv').config();
const express = require('express');

const authRoutes = require('./src/infrastructure/http/routes/user-auth.router');

const app = express();
app.use(express.json());


// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});