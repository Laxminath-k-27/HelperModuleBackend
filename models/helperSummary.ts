import mongoose, { Document, Schema } from "mongoose";

export interface IEmployeeSummary extends Document {
  employeeId: string;
  fullName: string;
  services: string;
  photo: string;
  phoneNumber: string;
}

const employeeSummarySchema: Schema<IEmployeeSummary> = new Schema({
  employeeId: { type: String },
  fullName: { type: String },
  services: { type: String },
  photo: { type: String },
  phoneNumber: { type: String },
});

const EmployeeSummary = mongoose.model<IEmployeeSummary>(
  "EmployeeSummary",
  employeeSummarySchema
);

export default EmployeeSummary;


// const mongoose = require('mongoose');

// const employeeSummarySchema = new mongoose.Schema({
//   employeeId: String,
//   fullName: String,
//   services: String,
//   photo: String,
//   phoneNumber: String
// });

// module.exports = mongoose.model('EmployeeSummary', employeeSummarySchema);
