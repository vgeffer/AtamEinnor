const csprng = require("random-number-csprng");

router.post("/api/auth/resetrefreshtoken", async (req, res, next) => {
	await query("UPDATE `users` SET `refreshToken`=? WHERE `ID`=?;", [await randomStringCS(52), req.user.id]);
	res.status(200).json({message: "success"});
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