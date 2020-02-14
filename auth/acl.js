'use strict ';

const Users = require('./users.js');


module.exports = (capability) => { //high order function
    return(req, res, next) => {
        try {
            if (req.user.capabilities.include(capability)){
                next();
            } else {
                next ('you have no permition');
            }
        } catch(err){
            next('errorrrr');
        }
    }
}