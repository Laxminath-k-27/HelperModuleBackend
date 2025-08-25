import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myapp");

    console.log("MongoDB connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("MongoDB connection failed with unknown error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;


// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/myapp', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
