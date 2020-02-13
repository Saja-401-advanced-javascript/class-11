'use stricts';

const superagent = require('superagent');
const Users = require('./users.js');
const jwt = require('jsonwebtoken');
let SECRET = 'authentecation';



const tokenServerUrl = process.env.tokenServerUrl;
const remoteAPI = process.env.remoteAPI; //give me an access to use my github info (about the user)
const CLIENT_ID = process.env.CLIENT_ID; //public id
const CLIENT_SECRET = process.env.CLIENT_SECRET; // secret key
const API_SERVER = process.env.API_SERVER;


async function codeTokenExchanger(code) {
  let response = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  let returnedToken = response.body.access_token;
  return returnedToken;
}

async function remoteInfo(token) {
  let response = await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = response.body;
  return user;
}

async function getUser(user) {
    
  let record = {
    username: user.login,
    password: 'calss12pw',
  };

  let user2 = record.username;  
  let token = jwt.sign({ password: user2.password, id: user2._id, username: user2.username }, SECRET);
  new Users(record).save;
  return [user2, token];

}


module.exports = async function megaFnction(req, res, next) {
  try {

    let code = req.query.code;        

    let remortToken = await codeTokenExchanger(code);

    let remoteUser = await remoteInfo(remortToken);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;

    next();
  } catch (error) { next('error'); }
};