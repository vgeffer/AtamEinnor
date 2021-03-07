const jwt = require("jsonwebtoken");

router.post("/api/refreshtoken", async (req, res, next) => {
	if (! Number.isInteger(req.body.id)){
		res.status(400).json({message: "id must be of type int"});
		return;
	} else if (typeof req.body.refreshToken !== "string"){
		res.status(400).json({message: "refreshToken must be of type string"});
		return;
	}

	const user = await query("SELECT * FROM `users` WHERE `ID`=?;", [req.body.id]);
	if (typeof user[0] !== "undefined"){
		if (req.body.refreshToken === user[0].refreshToken){
			const token = jwt.sign({id: user[0].ID, username: user[0].username}, jwtSecret, {expiresIn: 10 * 60});
			res.status(200).json({
				id: user[0].ID,
				username: user[0].username,
				token: token,
				exp: Date.now() + 10 * 60 * 1000 - 5000,
				refreshToken: user[0].refreshToken
			});
		} else {
			res.status(403).json({message: "wrong token"});
		}
	} else {
		res.status(404).json({message: "user not found"});
	}
});