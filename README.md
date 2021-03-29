# client-management-web

## What does the website do?
This website is designed for controlling client influx from a Google Sheets spreadsheet linked Google Form into different user pages. Each user has the hability to request more clients from the Google Sheets and see their information displayed on screen. Administrators can access each user page with their current clients, add more users to the platform or search for a particular client in the database.

## What technologies were used for this project?
Both frontend and backend are completely built using JavaScript.
* Frontend
    * HTML and CSS/Bootstrap
* Backend
    * Node.js
    * Express for the route handling and the file serving
    * EJS for Customizable "HTML" files
    * Passport for authentication and sessions
    * Google Sheets API to connect to the clients spreadsheet
    * Mongoose for the Database
* Database
    * MongoDB
    * Hosted on AtlasCloud

## What was the idea of this project?
Solve a business problem with a scalable solution using an already existing infrastructure built in Google Sheets. Authentication and Privileges need to be established to separate employees from managerial positions.

### A more complete on the logs of the project can be found in the file LOG.md