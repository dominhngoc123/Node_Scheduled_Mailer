const express = require("express");
const mysql = require("mysql");
const cron = require('cron');
const nodemailer = require("nodemailer");
const config = require("./config");
const Email = require("./model/email");
const randomstring = require("randomstring");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to database
// Create a connection object which is used database credential from config.js
const connection = mysql.createConnection(config);
connection.connect();

// Query database to get all active email and set a cronjob for it
// Run query
connection.query(
  "SELECT * FROM emails WHERE email_status = 1",
  (error, results) => {
    if (error) {
      console.error(error);
    } else {
      results.forEach((email) => {
        createEmailCronjob(email);
      });
    }
  }
);

// Create cron-job for each email to send it at a specific time

function createEmailCronjob(email) {
  const emailCronjob = new cron.CronJob(email.scheduled_time, function () {
    sendEmail(email);
  });
  emailCronjob.start();
}

// Insert to database.

// Function 1: Insert to database.
// This will insert the email model, which is sent from api to the database to store.
// When cron-job is running, it will query to get the job which need to be executed
// Param:
// + to_email: receiver email address
// + subject: subject of email
// + body: body of email
// + scheduled_time: time to automatically send email in cronjob
// Time syntax for cronjob
//  ┌────────────── Second (optional)
//  │ ┌──────────── Minute
//  │ │ ┌────────── Hour
//  │ │ │ ┌──────── Day in month
//  │ │ │ │ ┌────── Month
//  │ │ │ │ │ ┌──── Day in week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *
// + email_status: status of email (1 for ACTIVE OR 0 for INACTIVE)
// + scheduled_type: type for scheduled email (DAILY, WEEKLY OR MONTHLY)

function storeEmail(
  to_email,
  subject,
  body,
  scheduled_time,
  email_status = 1,
  scheduled_type
) {
  const job_name = randomstring.generate(20);
  const query =
    "INSERT INTO emails (to_email, subject, body, scheduled_time, email_status, scheduled_type, job_name) VALUES (?, ?, ?, ?, ?, ?, ?)";    
  connection.query(
    query,
    [to_email, subject, body, scheduled_time, email_status, scheduled_type, job_name],
    (error, results) => {
      if (error) {
        return false;
      } else {
        const email = new Email({
          to_email,
          subject,
          body,
          scheduled_time,
          email_status,
          scheduled_type,
          job_name
        });
        console.log(email);
        createEmailCronjob(email);       
      }
    }
  );
  return true;
}

// Create api for user to send data from client
// The api require those parameters from body of the request: to_email, subject, body, scheduled_time, email_status, scheduled_type

app.post("/setup-scheduled-email", (request, response) => {
  // Get params from body
  const to_email = request.body.to_email;
  const subject = request.body.subject;
  const body = request.body.body;
  const scheduled_time = request.body.scheduled_time;
  const email_status = request.body.email_status;
  const scheduled_type = request.body.scheduled_type;
  // Stored to database and get the query reult
  const isStored = storeEmail(
    to_email,
    subject,
    body,
    scheduled_time,
    email_status,
    scheduled_type
  );
  // Send response to client
  console.log(isStored);
  if (isStored) {
    response.status(200).send("Email scheduled successfully");
  } else {
    response.status(500).send("Error scheduling email");
  }
});

// Step 3: Running cron-job.
// This will scan the system to get the job with scheduled time to execute.

function sendEmail(email) {
  // Implement your email sending logic using nodemailer here
  // Make sure to use your own SMTP details
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "nd6120902@gmail.com",
      pass: "kvyw hozl kamt kmqp",
    },
  });

  const mailOptions = {
    from: "ngocdmgch211114@fpt.edu.vn",
    to: email.to_email,
    subject: email.subject,
    text: email.body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
}
