### March 9th, 2021
* Expand the google sheets library:
    * Create general Google Sheets functions to read and update values
    * Create specific app GS functions that handle the client information

### March 10th, 2021
* Finish the google sheets library
* Start working on Passport setup for authentication and cookies for sessions

### March 11th, 2021
* Finish the Passport config
* Start working on routing for secure access
* Start working on sending client information from backend to frontend
    * Current Solution: use global scope variables in the backend to save the last qeued client
    * New Solution: create a frontend script to handle the requests

### March 12th, 2021
* Solve empty client response from the backend
* Pop-up in the frontend when the client
* Initial solution for the current clients card
    * Local variable in the frontend with an array of values
* ! When refreshing, the information gets lost
    * Solution: Use database to hold clients
* Heroku Deployment
    * Need a Store for the [sessions](https://www.npmjs.com/package/connect-mongo)

### March 13th, 2021
* Solve the issue that allowed more than 7 clients at the same time
* Implement logout
* Styling to center buttons
* Redirect when failed login
* First admin view - routing

### March 17th, 2021
* Created the admin view
* Created the admin/users view
* Frontend and backend for admin/users

### March 20th, 2021
* Created the admin/add view
* Backend to add the new user to the database
* Authentication Problem: [privileges](https://developerhandbook.com/passport.js/passport-role-based-authorisation-authentication/)

### March 21st, 2021
* First solution for privilege authentication problem
    * Use a user-declared function that looks at the MongoDB database to check the privilege of the user
    * Problem: modularity (readibility of the code)
    * Possible solution: create an independent file with the function and include req.isAuthenticated steps in it
* Initial view for admin/search
* Basic functionality for admin/search
    * Mongoose RegExp to get all the clients with a determined name
    * Frontend simple code to add information to a table
* Add search criteria for phone number
* Second solution for privilege authentication problem
    * Use `.exec()` and return the entire `find()` promise
    * Followed this Stack Overflow [post](https://stackoverflow.com/questions/53688901/javascript-async-await-not-waiting-for-mongoose-await)
* Add authentication to /user/:user route - only admin
* Commented code on routes




## TO-DO
- [ ] Sanitize user inputs
- [ ] Manage extreme cases
    - [ ] Google Sheets
    - [ ] Log In
    - [ ] Database changes
- [ ] MVC Structure