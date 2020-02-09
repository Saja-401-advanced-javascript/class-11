
'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const basicAuth = require('./basic-mid-auth');
const Users = require('./users.js')
const logger = require('../middleware/logger.js');
const notFoundHandler = require('../middleware/404.js');
const errorHandler = require('../middleware/500.js');

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// when sign up u dont need to run through basic of couse it creating it for me and give me a token (unreadble)
app.post('/signup', (req, res) => {

  let user = new Users(req.body)
  user.save()
    .then(newUser => {
      let token = Users.tokenGenerator(newUser);
      res.status(200).send(token);
    })
});

// when sign in u need to run basic off to make sure i am who i am
app.post('/signin', basicAuth, (req, res) => {

  res.status(200).send(req.token);// give a token using in future to give me accsses to my account
});

app.use(logger);
app.use(errorHandler);
app.use(notFoundHandler);

module.exports = {
  server: app,
  start: () => {
    let PORT = 9000;
    app.listen(PORT, () => console.log(`The Server Is Breathing on PORT ${PORT}`));
  },
};

