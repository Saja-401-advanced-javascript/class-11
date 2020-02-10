'use strict';

const superagent = require('superagent') //for API
const users = require('./users.js');

const tokenServerUrl = 'https://github.com/login/oauth/access_token'; // log in oauth access token, when i make a post request to the base url, i am trying to get an access token back
const remoteAPI = 'https://api.github.com/user'; //give me an access to use my github info (about the user)
const CLIENT_ID = '36f6d35de7fc8aab66a8'; //public id
const CLIENT_SECRET ='9b50a6590e43b3406b215cf2f6e1cc0b7e86f21c'; // secret key
const API_SERVER =  'http://localhost:9000/oauth';

// we wnat to get usename and pw info from github


//multi methodes hooked in one large methode
// to invoke the methods down there
module.exports = async function authorize(req, res, next) {
  console.log('55555555555555555555555554444');

    try {
      
      let code = req.query.code; // handshake, github give me the code, to give me the token
      console.log('(1) CODE:', code);
  
      let remoteToken = await exchangeCodeForToken(code); // we exchange the code to get a token(not authorization token)
      console.log('(2) ACCESS TOKEN:', remoteToken)
  
      let remoteUser = await getRemoteUserInfo(remoteToken); // we used the token to get our github info (user info)
      console.log('(3) GITHUB USER', remoteUser) //give me a user object
  
      let [user, token] = await getUser(remoteUser);
      req.user = user;// middleware(name)
      req.token = token; 
      console.log('(4) LOCAL USER', user);
  
      next();//middleware
    } catch (e) { next(`ERROR: ${e.message}`) }
  
  }
  


  async function exchangeCodeForToken(code) {
    console.log('55555555555555555');
    
  // we need it to pass it a responce object(tokenResponse)
  // superagent to make a remote call
  //.send => is a superagent methode to attach arequest body to a post request(to give info to the remote token server) 
    let tokenResponse = await superagent.post(tokenServerUrl).send({ // post request to send info 
      code:code
       , // we gonna pass it a code
      client_id: CLIENT_ID ,
      client_secret:CLIENT_SECRET,
      redirect_uri: API_SERVER ,     
      //redirect_uri => how to get back to our page
      grant_type: 'authorization_code',
    })
    
    
    let access_token = tokenResponse.body.access_token;
    console.log('tttttttttt',tokenResponse.body );
    
    console.log('yyyyyyy', access_token)
    //token responce => assigned to the responce from this call, we are passing github which is our token url (all info about the app and the client info )
  //token responce => say : thats the responce from the api call which is a big object, thee object has property called body which has an accsses token
    return access_token; // an object come back from the post req which has a property caleed body (have all kind of stuff)
  
  }
  


  async function getRemoteUserInfo(token) { //username and pw
  // i need a token to give it to github then github will give me info about myself
    let userResponse =
      await superagent.get(remoteAPI)
      // .set => set headers (superagent method)
        .set('user-agent', 'express-app') // kind of app we working with
        .set('Authorization', `token ${token}`) // bearer of a token == I own the token
  
    let user = userResponse.body;
  //userResponse => all my github info 
  // userResponse.body => limit the responce (object of username and pw)
    return user;
  
  }
  
  async function getUser(remoteUser) {
    let userRecord = {
      username: remoteUser.login,
      password: 'oauthpassword' //whatever
    }
  
    let user = await users.save(userRecord);
    
    let token = users.generateToken(user);
    console.log('uuuuuuu', token);
  
    return [user, token];
  
  }