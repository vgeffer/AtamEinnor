const mysql = require("mysql");
const con = mysql.createConnection({
	host: "127.0.0.1",
	user: "svatykotol",
	password: "INSERT_YOUR_PASSWORD_HERE", //heslo do MySQL databázy...
	database: "svkotoldb",
	charset : "utf8mb4"
});

con.connect((err) => {
	if (err) throw err;
	console.log("[INFO] MySQL connected");
	query("SET SQL_SAFE_UPDATES=0;");

	setInterval(() => {
		query("SELECT 1;")
	}, 120 * 60 * 1000);
});

query = function(query_string, values){
	if (typeof values === "undefined"){
		values = [];
	}
	return new Promise((resolve, reject) => {
		con.query(query_string, values, (err, result) => {
			if (err){
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
