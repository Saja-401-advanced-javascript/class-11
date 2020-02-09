'use strict';

const base64 = require('base-64');
const Users = require('../auth/users.js');


module.exports = (req, res, next) => { // middleware to modify the request  
  //req.headers.authorization => when insert your username and pw
  if (!req.headers.authorization) { next('error'); return; }
  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');// => give the actual username and pw (decoded)
  let auth = { user, pass };

  Users.basicAuth(auth) // in the user.js  
    .then(validUser => {
      req.token = Users.tokenGenerator(validUser);
      next();
    }).catch(err => next('error'));
};
