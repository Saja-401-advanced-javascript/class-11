
'use strict';

const express = require('express');
const basicAuth = require('./basic-mid-auth');
const users = require('./users.js');
const oauth = require('./oath-middleware')
const logger = require('../middleware/logger.js');
const notFoundHandler = require('../middleware/404.js');
const errorHandler = require('../middleware/500.js');

const app = express(); // if we make a post request we have to use express JSON so it will parse the request body 


app.use(express.json());




// index.html => we need to be able to publicaly serve info from that 
app.use(express.static('/public'));





// when sign up u dont need to run through basic of couse it creating it for me and give me a token (unreadble)
app.post('/signup', (req, res) => {//post request
  users.save(req.body) // req.body => some basic info
    .then(user => {
      let token = users.generateToken(user);
      res.status(200).send(token);
    });
});



// when sign in u need to run basic off to make sure i am who i am
app.post('/signin', basicAuth, (req, res) => { // post request 
  res.status(200).send(req.token);// give a token using in future to give me accsses to my account
});
//basicAuth => middlewae

app.get('/users', basicAuth, (req, res) => { // get request
  res.status(200).json(users.list());
});


app.get('/oauth', oauth, (res, req) => {
  res.status(200).send(res.token);
})

app.use(logger);
app.use(errorHandler);
app.use('*', notFoundHandler);

module.exports = {
  server : app,
  start : port => {
    let PORT = port || process.env.PORT || 6000;
    app.listen(PORT , ()=> console.log(`The Server Is Breathing on PORT ${PORT}`));
  },
};