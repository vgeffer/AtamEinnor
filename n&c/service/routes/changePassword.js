const bcrypt = require("bcryptjs");
const csprng = require("random-number-csprng");

router.post("/api/auth/changepassword", async (req, res, next) => {
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	if (typeof oldPassword !== "string"){
		res.status(400).json({message: "oldPassword must be of type string"});
		return;
	} else if (typeof newPassword !== "string"){
		res.status(400).json({message: "newPassword must be of type string"});
		return;
	} else if (newPassword.length < 6){
		res.status(400).json({message: "password is too short, min. 6 characters"});
		return;
	}

	const user = await query("SELECT `password` FROM `users` WHERE `ID`=?;", [req.user.id]);
	
	if (await bcrypt.compare(oldPassword, user[0].password)){
		const refreshToken = await randomStringCS(52);
		await query("UPDATE `users` SET `password`=?, `refreshToken`=? WHERE `ID`=?;", [await bcrypt.hash(newPassword, 10), refreshToken, req.user.id]);
		res.status(200).json({refreshToken: refreshToken});
	} else {
		res.status(403).json({message: "wrong password"});
	}
});

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