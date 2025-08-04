const mongoose = require('mongoose');

const employeeSummarySchema = new mongoose.Schema({
  employeeId: String,
  fullName: String,
  services: [String]
});

module.exports = mongoose.model('EmployeeSummary', employeeSummarySchema);
