const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
	const token = req.header("token");
	if (typeof token === "undefined"){
		res.status(401).send("Access denied");
	} else {
		try {
			const payload = jwt.verify(token, jwtSecret);
			req.user = payload;
			next();
		} catch(err){
			switch (err.name){
				case "TokenExpiredError":
					res.status(401).send("Token expired");
					break;
				default:
					res.status(400).send("Invalid token");
			}
		}
	}
};