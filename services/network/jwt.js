//Import libs
const jwt = require('jsonwebtoken');
 
//Private key of JWT signature generator
const private_key = "9a56e17dfa19b24dfe06021ab41bd9da969693e8e177d3e4cc17b0a7ac36b105";

//Function, that verifies, if supplied JWT is valid one
//If it's valid, return decoded version
//If it's invalid, return undefined
exports.verify_jwt = function(token) {

    //Check, if the input isn't null or undefined
    if(token == undefined) return undefined;

    //Asynchronously verify the token
    return new Promise((resolve, reject) => {
        jwt.verify(token, private_key, { algorithms: ['HS256'] }, function(err, token){
            if(err) { return resolve(undefined); } //If there's an error, return undefined
            resolve(token); //If the token was succesfully validated, return it's decoded version
        });
    });
}

//Function, that allows server to generate JWT's
//JWT is used as id of a player
//Each JWT is valid for 12 hours from the time of creation
exports.sign_jwt = function(payload) {
    return jwt.sign(payload, private_key, { algorithm: 'HS256', expiresIn: 12 * 60 * 60 });
}