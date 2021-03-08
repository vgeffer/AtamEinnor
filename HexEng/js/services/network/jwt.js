const jwt = require('jsonwebtoken');
 
const private_key = "2598e6536e5217aeadacf84ddf8095a40c560e8576b3622e78dcdd3f9ba5c2db";

exports.verify_jwt = function(token) {
    return new Promise((resolve, reject) => {
    //TODO PROMISE
        jwt.verify(token, private_key, { algorithms: ['HS256'] }, function(err, token){
            if(err) { console.log(err); resolve(undefined); }
            resolve(token);
        });
    });
}

exports.sign_jwt = function(payload) {
    return jwt.sign(payload, private_key, { algorithm: 'HS256', expiresIn: 43200 });
}