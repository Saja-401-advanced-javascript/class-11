'use strict';

// we gonna create a basic authentication peice of meddleware that gonna base-64 encode smth and attach it to the request headers

const bcrypt = require('bcryptjs'); // hash and compare a pw against a hashed pw
const jwt = require('jsonwebtoken'); //two factor layer:pw and SECRET

// to add another layer of securety and to use as conjection with jwt

let SECRET = process.env.SECRET || 'topSecret';
// console.log('////////', SECRET);

let db = {};
let users = {};
// we wanna attach users to db



// save is a method related to users obj
// async : we want bcrypt to do operations and when u done give info that i use to hash 
users.save = async function (record) { // record is an object
  // if we dont have the username in the db then save the pw after hashing it so it is unreadble

  // record example : {
  //     "Saja": {
  //         "username": "Saja",
  //         "password": "$2a$05$TOj.ccN5gtQ4orp/fJHL6OAEtcEwsESaWdRhKorsPaPziA3yazYY2"
  //     }
  // }
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


