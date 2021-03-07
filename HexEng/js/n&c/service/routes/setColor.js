const hexAllowedChars = "0123456789abcdef";

router.post("/api/auth/setcolor", async (req, res, next) => {
	let color = req.body.color;

	if (typeof color !== "string"){
		res.status(400).json({message: "color must be of type string"});
		return;
	} 
	
	color = color.toLowerCase();

	if (color.length !== 7){
		res.status(400).json({message: "invalid hex"});
		return;
	} else if (color.substring(0, 1) !== "#"){
		res.status(400).json({message: "invalid hex"});
		return;
	}

	for (let i = 1; i < 7; i++){
		if (hexAllowedChars.indexOf(color.charAt(i)) === -1){
			res.status(400).json({message: "invalid hex"});
			return;
		}
	}
	
	await query("UPDATE `users` SET `color`=? WHERE `ID`=?;", [color, req.user.id]);
	res.status(200).json({message: "color set"});
});