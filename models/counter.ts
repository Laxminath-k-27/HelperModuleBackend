import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
  name: string;
  seq: number;
}

const counterSchema: Schema<ICounter> = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model<ICounter>("Counter", counterSchema);

export default Counter;


// const mongoose = require('mongoose');

// const counterSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   seq: { type: Number, default: 0 }
// });

// module.exports = mongoose.model('Counter', counterSchema);
