Step 1: Create a database named node_email.
Step 2: In this database, run the below script to create table:
CREATE TABLE emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    email_status SMALLINT NOT NULL,
    scheduled_type VARCHAR(50) NOT NULL,
    job_name VARCHAR(20) NOT NULL
);
Step 3: Clone the code to a specific folder, change directory to the project and run npm install to install the required libraries.
Step 4: Run the code.
Step 5: To add an email to start a job, open postman:
+  Choose POST method.
+  Change url to: http://localhost:3000/setup-scheduled-email
+  In tab headers, change the Content-Type into application/json.
+  In tab body, choose Raw -> Json and type the following into textarea:
{   
    "to_email": "<realworld_receiver email>",
    "subject": "Test api",
    "body": "Test api body",
    "scheduled_time": "* * * * *",
    "email_status": 1,
    "scheduled_type": "WEEKLY"
}
Remember that we use scheduled_type for categorized the job in client view, not use in node js job.
The most important thing in this feature is scheduled_time.

Time syntax for cronjob
//  ┌────────────── Second (optional)
//  │ ┌──────────── Minute
//  │ │ ┌────────── Hour
//  │ │ │ ┌──────── Day in month
//  │ │ │ │ ┌────── Month
//  │ │ │ │ │ ┌──── Day in week
//  │ │ │ │ │ │
//  │ │ │ │ │ │
//  * * * * * *
We do not need to set the second in this string.
If we set any "*" character into number or some specific character, it will change the scheduled time accordingly.
For example: 
If the scheduled_time is * * * * *, it means that the job run each minutes.
If the scheduled_time is 0 * * * *, it means that the job run at the start (0 minutes) of each hour
If the scheduled_time is 0 0 * * *, it means that the job run at the start (00:00) of each day
If the scheduled_time is 0 0 1 * *, it means that the job run at first day of each month.
Etc.

Value range of each field
Second:	      0-59
Minute:	      0-59
Hour:  	      0-23
Day in month:	1-31
Month:      	1-12 or JAN-DEC
Day in week:	0-7 or SUN-SAT
