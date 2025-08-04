const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')
const app = express();

const helperRoutes = require('./routes/helperRoutes');

connectDB();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use('/api/helpers', helperRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


