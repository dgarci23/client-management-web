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

## To Do List
* Data validation from GS Library
* Possibility of refreshing page every certain time
* Loading clients when the user logs in
* Changing current client status
* Refactor the frontend Code
    * New functions for inserting the client