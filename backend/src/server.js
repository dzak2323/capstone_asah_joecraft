require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend JoeCraft siap digunakan!',
  });
});

// Pasang semua rute API
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});