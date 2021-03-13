const fs = require("fs");

const images = [
	fs.readFileSync("./service/storage/photos/unknown.png"),
	fs.readFileSync("./service/client/img/boy1.png"),
	fs.readFileSync("./service/client/img/boy2.png"),
	fs.readFileSync("./service/client/img/boy3.png"),
	fs.readFileSync("./service/client/img/girl1.png"),
	fs.readFileSync("./service/client/img/girl2.png"),
	fs.readFileSync("./service/client/img/girl3.png")
];

router.get("/api/photo", async (req, res, next) => {
	const user = await query("SELECT `photo` FROM `users` WHERE `ID`=?;", [req.query.user]);
	res.header("Content-Type", "image/png");
	if (typeof user[0] === "undefined"){
		res.send(images[0]);
	} else if (user[0].photo === 0){
		fs.readFile("./service/storage/photos/" + req.query.user + ".png", (err, data) => {
			if (err){
				res.send(images[0]);
			} else {
				res.send(data);
			}
		});
	} else {
		res.send(images[user[0].photo]);
	}
});