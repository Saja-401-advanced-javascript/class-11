'use strict';

// we gonna create a basic authentication peice of meddleware that gonna base-64 encode smth and attach it to the request headers

const bcrypt = require('bcryptjs'); // hash and compare a pw against a hashed pw
const jwt = require('jsonwebtoken'); //two factor layer:pw and SECRET
const mongoose = require('mongoose');


let SECRET = "authentecation";

const Users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// mongoose.model('users', Users);

Users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
  // console.log('4444444', this.password);
  
  
})

// console.log('bcrypttttt ', Users);

// statics => cannot use this in this function, it belongs to everyone, used to save memory 
Users.statics.basicAuth =  function (auth) { // compare my pw with a hashed one.. if it valid => great 
  let userToFind = { username: auth.user }
  console.log('***********',userToFind)
  return  this.findOne(userToFind)
  .then (person =>{
    // console.log('9999999', person.password);
    console.log('8888888888888888', person || person.passwordComparator(auth.pass))
    return person && person.passwordComparator(auth.pass)})
    // console.log('gggggggggggg', );

    .catch(console.error); 
  }
  
  Users.methods.passwordComparator = function(pass){
    console.log('passssss', pass);
    console.log('ssskkkksssss', this.password);
    
    
    return bcrypt.compare(pass, this.password)
    .then(valid => {
      
      console.log('5555555', valid);
     return valid ? this : null})
}


// Users.statics.basicAuth = async function (user, pass) { /// I got confused to use eathier statcs or methods for this function
 
//   let valid = await bcrypt.compare(pass, this.password);
//   console.log('jjjjjjj', valid);
  
//   return valid ? user : Promise.reject();
// };
// console.log('**************************************',Users.statics.basicAuth('saja','555') );


Users.statics.tokenGenerator = function () {
  console.log('sssssssssss');
  
  let token = jwt.sign({ id: user._id }, SECRET);
  return token;
};
// give a unique token used to authorization using 2-factors layer : username and SECRET 
module.exports = mongoose.model('users', Users);


