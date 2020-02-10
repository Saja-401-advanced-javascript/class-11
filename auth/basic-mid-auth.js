'use strict';

const base64 = require('base-64'); 
const users = require('../auth/users.js');
// console.log('ddddddddddd');


module.exports = (req, res, next) => { // middleware to modify the request

  if(!req.headers.authorization) { next('invalid login'); return; }   // req.header is an obj which has an autherzation header which is a base64 encoded string not the actual username an pw (ex ABC:123)
  let basic = req.headers.authorization.split(' ').pop(); // split turnes a string into an array and pop removes the last item of the array 
  // pull up the encoded part by splitting the header into an array and pop out the second element
  console.log('req auth headers:', req.headers.authorization);
  console.log('basic:', basic);
  
  let [user, pass] = base64.decode(basic).split(':');// => give the actual username and pw (decoded)
  
  console.log('decoded user/pw', [user, pass]);
  
  users.authenticateBasic(user, pass) // in the user.js
    .then(validUser => {
      req.token = users.generateToken(validUser);
      console.log('token:', req.token);
      next();
    }).catch( err => next('invalid login'));
};
