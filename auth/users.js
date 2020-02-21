'use strict';

// we gonna create a basic authentication peice of meddleware that gonna base-64 encode smth and attach it to the request headers

const bcrypt = require('bcryptjs'); // hash and compare a pw against a hashed pw
const jwt = require('jsonwebtoken'); //two factor layer:pw and SECRET
const mongoose = require('mongoose');


let SECRET = 'authentecation';

const Users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {type: String, required: true, default:'user', enum:['user', 'editor', 'admin']},
});


Users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);


});


// statics => cannot use this in this function, it belongs to everyone, used to save memory 
Users.statics.basicAuth = function (auth) { // compare my pw with a hashed one.. if it valid => great 
  let userToFind = { username: auth.user };
  return this.findOne(userToFind)
    .then(person => {
      return person.passwordComparator(auth.pass);
    })
    .catch(console.error);
};

Users.methods.passwordComparator = function (pass) {
  return bcrypt.compare(pass, this.password)
    .then(valid => {
      return valid ? this : null;
    });
};


// Users.statics.basicAuth = async function (user, pass) { /// I got confused to use eathier statcs or methods for this function
Users.statics.tokenGenerator = function (user) {
  let userPosition = {
    username: user.username,
    ability : user.role,
  };

  
  return jwt.sign(userPosition, SECRET);
};
// give a unique token used to authorization using 2-factors layer : username and SECRET 


Users.statics.tokenAuthenticater = async function(token){  
  
  try {
    
    let tokenObj = jwt.verify(token, SECRET);
    
    if (tokenObj) {
      return Promise.resolve(tokenObj);
    } else {
      return Promise.reject();
    }
  } catch (err) {
    return Promise.reject();
  }
};

Users.statics.capabilitiesChecker = (ability, role) => {
  let admin = ['read', 'create', 'update', 'delete'];
  let user = ['read', 'create', 'update'];
  let guest = ['read'];
  if (role === 'admin') {
    for (let i = 0; i < admin.length; i++) {
      if (admin[i] === ability) {
        return true;
      }
    }
  }
  if (role === 'user') {
    for (let i = 0; i < user.length; i++) {
      if (user[i] === ability) {
        return true;
      }
    }
  }
  if (role === 'guest') {
    for (let i = 0; i < guest.length; i++) {
      if (guest[i] === ability) {
        return true;
      }
    }
  }
};

module.exports = mongoose.model('users', Users);


