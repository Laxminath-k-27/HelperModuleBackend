const mongoose = require('mongoose');

const helperSchema = new mongoose.Schema({
    employeeId: String,
    fullName: String,
    email: String,
    services: [String],
    organization: String,
    languages: [String],
    gender: String,
    phonePrefix: String,
    phoneNumber: String,
    vehicleType: String,
    vehicleNumber: String,
    photo: String,
    kycDocument: String,
    kycDocType: String,
    otherDocument: String,
    otherDocType: String
});

module.exports = mongoose.model('Helper', helperSchema);
