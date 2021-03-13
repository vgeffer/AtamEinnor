const images = {
	boy1: 1,
	boy2: 2,
	boy3: 3,
	girl1: 4,
	girl2: 5,
	girl3: 6
};

router.post("/api/auth/choosephoto", async (req, res, next) => {
	if (typeof req.body.image !== "string"){
		res.status(400).json({message: "image must be of type string"});
		return;
	}

	const imageNumber = images[req.body.image];
	if (typeof imageNumber !== "undefined"){
		await query("UPDATE `users` SET `photo`=? WHERE `ID`=?;", [imageNumber, req.user.id]);
		res.status(200).json("photo set");
	} else {
		res.status(400).json({message: "image not found"});
	}
});