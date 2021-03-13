express = require("express");
app = express();
router = express.Router();

jwtSecret; //256-bit secret key

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const fileUpload = require("express-fileupload");
app.use("/api/auth/uploadphoto", fileUpload({limits: {fileSize: 10 * 1000 * 1000}}));

require("./mysql_connect");
require("./service/routes/login");
require("./service/routes/register");
require("./service/routes/photo");
require("./service/routes/refreshToken");

app.use("/api/auth/*", require("./jwt"));

require("./service/routes/uploadPhoto");
require("./service/routes/choosePhoto");
require("./service/routes/setColor");
require("./service/routes/resetRefreshToken");
require("./service/routes/changePassword");

app.use("/", express.static("./service/client"));
app.use("/", router);

const http = require("http");

const server = http.createServer(app);
server.listen(8100, "0.0.0.0");

require("./service/websocket/socket")(server);