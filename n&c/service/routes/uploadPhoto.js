const Jimp = require("jimp");

router.post("/api/auth/uploadphoto", async (req, res, next) => {
	if (typeof req.files.photo !== "undefined"){
		Jimp.read(req.files.photo.data)
		.then(async (image) => {
			let x, y, side;
			if (image.bitmap.width > image.bitmap.height){
				x = Math.floor((image.bitmap.width - image.bitmap.height) / 2);
				y = 0;
				side = image.bitmap.height;
			} else {
				x = 0;
				y = Math.floor((image.bitmap.height - image.bitmap.width) / 2);
				side = image.bitmap.width;
			}

			image.crop(x, y, side, side).resize(300, 300).write("./service/storage/photos/" + req.user.id + ".png");
			await query("UPDATE `users` SET `photo`=? WHERE `ID`=?;", [0, req.user.id]);
			res.status(200).json("photo set");
		})
		.catch(err => {
			console.log(err);
			res.status(400).json({message: "failed to load image"});
		});
	} else {
		res.status(400).json({message: "no image uploaded"});
	}
});