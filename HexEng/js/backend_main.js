
const http          = require('http');
const crypto        = require('crypto');
const fs            = require('fs');
const url           = require('url'); 
const path          = require('path');

const network = require('./backend_network.sj');



const err403 = "<title>403: Access denied</title><h1>403:</h1>You don't have permision to view this content!";
const err404 = "<title>404: Not Found</title><h1>404:</h1>Unable to fetch ./www";


const server = http.createServer(async (req, res) => {

        if(req.method == 'POST'){
            var body = '';
            req.on('data', function (data) {
                body += data;
            });

            req.on('end', function() {
                var parsedBody = JSON.parse(body);


                switch(parsedBody.type){
                
                }


            });
        }
        else{
            let contPath = url.parse(req.url, true).pathname;
            let query = url.parse(req.url, true).query;
            var reqFile = null;

            //if url is in form url.dom/something/, append index.html to loaded path
            if(contPath.lastIndexOf("/") == contPath.length - 1)
                contPath += "index.html"; 

            const normalized = path.normalize(contPath);

            if (normalized.substring(0, 3) === "../" || normalized.substring(0, 2) === "./"){
                res.statusCode = 403;
                res.end(err403);
                return;
            }

            const fstream = fs.createReadStream(path.join("./www", normalized));
            fstream
            .on("error", (error) => {
                res.statusCode = 404;
                res.end(err404 + contPath);
                
                console.log(error);
            })
            .on("open", () => {
                fstream.pipe(res);
            });
        }
});


server.listen(6502, "127.0.0.1");