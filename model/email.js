// Model to store email object

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to_email: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  scheduled_time: { type: String, required: true },
  email_status: {type: Number, required: true},
  scheduled_type: {type: String, required: true},
  job_name: {type: String, required: true}
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;