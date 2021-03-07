const bcrypt = require("bcryptjs");
const csprng = require("random-number-csprng");

router.post("/api/register", async (req, res, next) => {
	const validity = validate(req.body);
	if (validity === 0){
		const select = await query("SELECT * FROM `users` WHERE `email`=? OR `username`=? LIMIT 1;", [req.body.email, req.body.username]);
		if (typeof select[0] === "undefined"){
			if (req.body.email === ""){
				req.body.email = null;
			}
			const passwordHash = await bcrypt.hash(req.body.password, 10);
			const refreshToken = await randomStringCS(52);
			const now = Date.now();
			await query("INSERT INTO `users` (`username`,`password`,`refreshToken`,`email`,`lastSeen`,`createdAt`) VALUES (?,?,?,?,?,?)", [req.body.username, passwordHash, refreshToken, req.body.email, now, now]);
			res.status(200).json({message: "success"});
		} else {
			if (select[0].username === req.body.username){
				res.status(403).json({message: "username taken"});
			} else {
				res.status(403).json({message: "email taken"});
			}
		}
	} else {
		res.status(400).json({message: validity});
	}
});

function validate(data){
	if (typeof data.username !== "string"){
		return "username must be of type string";
	} else if (typeof data.email !== "string"){
		return "email must be of type string";
	} else if (typeof data.password !== "string"){
		return "password must be of type string";
	} else if (data.username.length > 20){
		return "username is too long, max. 20 characters";
	} else if (data.username.length < 3){
		return "username is too short, min. 3 characters";
	} else if (data.password.length < 6){
		return "password is too short, min. 6 characters";
	} else if (data.email.length > 80){
		return "email is too long, max. 80 characters";
	} else {
		return 0;
	}
}

async function randomStringCS(length){
	const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charCount = charSet.length - 1;
	let string = "";
	for (let i = 0; i < length; i++){
		const index = await csprng(0, charCount);
		string += charSet.charAt(index);
	}
	return string;
}