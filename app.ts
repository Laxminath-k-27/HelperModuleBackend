import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import helperRoutes from "./routes/helperRoutes"

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.use("/api/helpers", helperRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;


// const express = require('express');
// const cors = require('cors')
// const app = express();

// const connectDB = require('./config/db');
// const helperRoutes = require('./routes/helperRoutes');

// connectDB();

// app.use(express.json());
// app.use(cors());
// app.use('/uploads', express.static('uploads'));

// app.get('/', (req, res) => {
//   res.send('Hello, Express!');
// });

// app.use('/api/helpers', helperRoutes);

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


