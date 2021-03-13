const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/api/login", async (req, res, next) => {
	if (typeof req.body.username !== "string"){
		res.status(400).json({message: "username must be of type string"});
		return;
	} else if (typeof req.body.password !== "string"){
		res.status(400).json({message: "password must be of type string"});
		return;
	}

	const user = await query("SELECT * FROM `users` WHERE `username`=?;", [req.body.username]);
	if (typeof user[0] !== "undefined"){
		const match = await bcrypt.compare(req.body.password, user[0].password);
		if (match){
			const token = jwt.sign({id: user[0].ID, username: user[0].username}, jwtSecret, {expiresIn: 10 * 60});
			res.status(200).json({
				id: user[0].ID,
				username: user[0].username,
				token: token,
				exp: Date.now() + 10 * 60 * 1000,
				refreshToken: user[0].refreshToken
			});
		} else {
			res.status(403).json({message: "wrong password"});
		}
	} else {
		res.status(404).json({message: "user not found"});
	}
});