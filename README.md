# TASK
It is necessary to implement 2 services. One user service, the other user action history service. The user service should have 3 endpoints:

1. User creation
2. User modification
3. Getting a list of users

User creation and modification events should be sent to the “user action history” service. Communication between services can occur in any way.
The “user action history” service should have a handle that will return the action history with filters by user id and page navigation. The framework can also be any. One of the services should be in JS, for the second you can use TS. DBMS - postgresql

# INSTALL
npm init
npm install express
npm install express-rate-limit
npm install monitor
npm install node-cache
npm install nodemon
npm install queue
npm install dotenv
npm install pg pg-pool
<!-- npm install -g typescript -->
npm install typescript --save-dev
npm install @types/pg

npm install --save-dev mocha
npm install --save-dev supertest
npm install --save-dev chai

# BUILD
tsc

# TEST
npm test

# RUN
npm start