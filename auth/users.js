'use strict';

// we gonna create a basic authentication peice of meddleware that gonna base-64 encode smth and attach it to the request headers

const bcrypt = require('bcryptjs'); // hash and compare a pw against a hashed pw
const jwt = require('jsonwebtoken'); //two factor layer:pw and SECRET
const mongoose = require('mongoose');


let SECRET = "authentecation" ;

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
})


//statics => cannot use this in this function, it belongs to everyone, used to save memory 
users.statics.authenticateBasic = async function (user, pass) { // compare my pw with a hashed one.. if it valid => great 
  let userToFind = { username: user }
  let found = await this.find(userToFind);
  if (found) {
    let valid = bcrypt.compare(pass, found[0].password);
    return valid ? found[0].username : Promise.reject();
  } else { Promise.reject(); }
}



users.methods.generateToken = function (user) {
  let token = jwt.sign({ id: this._id }, SECRET);
  return token;
};
// give a unique token used to authorization using 2-factors layer : username and SECRET 


module.exports = mongoose.model('users', users);


