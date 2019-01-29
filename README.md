# Guidelines
Submit the task on GIT.

Code should work on the latest version of Chrome.

Stack: ES6/ES7, React, Redux, Jest, Enzyme, Sinon

## Max time for the task - 1 hour
Submit everything that you were able to implement within one hour. 
We are not asking for low quality, fast code, but we are interested in understanding how you work by having you submit
any part of this task you can complete within no more than 1 hour of work.

## Task to implement

Implement tests for the existing functionality. Tests should be written on Jest and Enzyme.
You should mount the whole Messenger component and wrap it in the store Provider.
You should use sinon to stub all api methods (obligatory) and use fake timers (if you need any)

Test cases, that are required:
1. On click on a lead in "Leads list" new DialogWindow is opened and the request for getting leadInfo has been sent with the correct leadId
2. After the info about lead has been loaded, the request for getting leads texts history has been sent with the correct leadId
3. Loader has been shown in DialogWindow while texts request is in pending state
4. When texts are received, they are rendered in DialogWindow in the correct order
5. When a user types something in input of DialogWindow and clicks Enter - the message has been added at the end of the list and has loader next to it
6. On clicking on "-" the dialog is collapsed
7. On clicking on "X" the dialog is closed
8. On clicking on one more lead the second dialog is opened

## Additional task (should take 30 minutes)
In the Messenger component uncomment this logic "window.Echo.private().notification(this.handleNewNotification);" and implement the correct mock or stub using sinon,
that will allow to simulate push notifications for the status of newly sent message. Implement the test,
that will simulate the notification about successful sending of the message - in this case the loader should disappear next to newly sent message.
Take a look at "handleNewNotification" to better understand how to pass the data.

## Aim of the task
We're providing much shorten version of the real module from the application to test how you're able to deal with the already implemented logic,
understand it and test it. The code is not ideal - and it has been done also on purpose to see, how you can understand it.
Tests implementation is not the major part of the work, but we believe that this skill requires good understanding of the functionality, so that if you
can implement good tests, you will also be able to work efficiently on some new functionality.

## Run the boilerplate
    - npm install
    - npm start
    - npm test
