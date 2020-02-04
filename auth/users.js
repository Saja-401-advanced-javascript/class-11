'use strict';

// we gonna create a basic authentication peice of meddleware that gonna base-64 encode smth and attach it to the request headers

const bcrypt = require('bcryptjs'); // hash and compare a pw against a hashed pw
const jwt = require('jsonwebtoken'); //two factor layer:pw and SECRET
const models = require('../model/model.js');
const userSchema = require ('../model/ui-schema.js')

// to add another layer of securety and to use as conjection with jwt

let SECRET = process.env.SECRET || 'topSecret';
// console.log('////////', SECRET);





users.save = async function (record) { 

 
  if (!db[record.username]) {
    record.password = await bcrypt.hash(record.password, 5);

    db[record.username] = record;
    return record; // obj of username and pw
  }

  return Promise.reject();
};


users.authenticateBasic = async function (user, pass) { // compare my pw with a hashed one.. if it valid => great 
  let valid = await bcrypt.compare(pass, db[user].password);
  return valid ? db[user] : Promise.reject();
};

users.generateToken = function (user) {
  let token = jwt.sign({ username: user.username }, SECRET);
  return token;
};
// give a unique token used to authorization using 2-factors layer : username and SECRET 

users.list = () => db; // list is a function that return db

module.exports = users;


