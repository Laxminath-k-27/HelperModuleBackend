import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";


const helperSchema = new Schema({
  employeeId: { type: String },
  fullName: { type: String },
  email: { type: String },
  services: { type: String },
  organization: { type: String },
  languages: [{ type: String }],
  gender: { type: String },
  phonePrefix: { type: String },
  phoneNumber: { type: String },
  vehicleType: { type: String },
  vehicleNumber: { type: String },
  photo: { type: String },
  kycDocument: { type: String },
  kycDocType: { type: String },
  otherDocument: { type: String },
  otherDocType: { type: String },
  joinedDate: { type: Date },
});

export type HelperInput = InferSchemaType<typeof helperSchema>;

export type HelperDoc = HydratedDocument<HelperInput>;

const Helper = model<HelperDoc>("Helper", helperSchema);

export default Helper;




// const mongoose = require('mongoose');

// const helperSchema = new mongoose.Schema({
//     employeeId: String,
//     fullName: String,
//     email: String,
//     services: String,
//     organization: String,
//     languages: [String],
//     gender: String,
//     phonePrefix: String,
//     phoneNumber: String,
//     vehicleType: String,
//     vehicleNumber: String,
//     photo: String,
//     kycDocument: String,
//     kycDocType: String,
//     otherDocument: String,
//     otherDocType: String,
//     joinedDate: Date
// });

// module.exports = mongoose.model('Helper', helperSchema);
