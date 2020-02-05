'use strict';

const superagent = require('superagent') //for API
const users = require('./users.js');

const tokenServerUrl = process.env.TokenServerUrl;
const remoteAPI = process.env.RemoteAPI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

// we wnat to get usename and pw info from github


//multi methodes hooked in one large methode
module.exports = async function authorize(req, res, next) {

    try {
      let code = req.query.code;
      console.log('(1) CODE:', code);
  
      let remoteToken = await exchangeCodeForToken(code);
      console.log('(2) ACCESS TOKEN:', remoteToken)
  
      let remoteUser = await getRemoteUserInfo(remoteToken);
      console.log('(3) GITHUB USER', remoteUser)
  
      let [user, token] = await getUser(remoteUser);
      req.user = user;
      req.token = token;
      console.log('(4) LOCAL USER', user);
  
      next();
    } catch (e) { next(`ERROR: ${e.message}`) }
  
  }
  
  async function exchangeCodeForToken(code) {
  // we need it to pass it a responce object
  // superagent to make a remote call
  //.send => is a superagent methode to attach arequest body to a post request 
    let tokenResponse = await superagent.post(tokenServerUrl).send({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: API_SERVER,
      //redirect_uri => how to get back to our page
      grant_type: 'authorization_code',
    })
  
    let access_token = tokenResponse.body.access_token;
    //token responce => assigned to the responce from this call, we are passing github which is our token url 
  //token responce => say : ehats the responce from the api call which is a big object, thee object has property called body which has an accsses token
    return access_token;
  
  }
  
  async function getRemoteUserInfo(token) {
  // i need a token to give it to github then github wiil give me info about myself
    let userResponse =
      await superagent.get(remoteAPI)
      // .set => set headers
        .set('user-agent', 'express-app') // kind of app we working with
        .set('Authorization', `token ${token}`)
  
    let user = userResponse.body;
  //userResponse => all my github info 
  // userResponse.body => limit the responce (username and pw)
    return user;
  
  }
  
  async function getUser(remoteUser) {
    let userRecord = {
      username: remoteUser.login,
      password: 'oauthpassword'
    }
  
    let user = await users.save(userRecord);
    let token = users.generateToken(user);
  
    return [user, token];
  
  }