'use strict';

const base64 = require('base-64'); 
const users = require('../auth/users.js');

// users.methods.tokenGenerator = function (user) {
//   let token = jwt.sign({ username: this.username }, SECRET);
//   return token;
// };


module.exports = (req, res, next) => { // middleware to modify the request
//req.headers.authorization => when insert your username and pw
  if(!req.headers.authorization) { next('error'); return; }   // req.header is an obj which has an autherzation header which is a base64 encoded string not the actual username an pw (ex ABC:123)
  let basic = req.headers.authorization.split(' ').pop();
  console.log('sssssssssssssssss', basic);
   // split turnes a string into an array and pop removes the last item of the array 
  // pull up the encoded part by splitting the header into an array and pop out the second element
  // console.log('req auth headers:', req.headers.authorization);
  // console.log('basic:', basic);
  
  let [user, pass] = base64.decode(basic).split(':');// => give the actual username and pw (decoded)
  let auth = {user, pass};
  console.log('authhhh', auth);
  
  // console.log('decoded user/pw', [user, pass]);
  
  users.basicAuth(auth) // in the user.js
    .then(validUser => {
      console.log('rrrrrrrrrrrr', validUser);
      
      req.token = validUser.tokenGenerator(validUser);
      console.log('585858',req.token);
      // console.log('token:', req.token);
      next();
    }).catch( err => next('error'));
};
