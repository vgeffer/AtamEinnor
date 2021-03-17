const world = require("world.js");

exports.ParsePlayerAction = function(action, room, ws) {

    switch (action.type) {

        case "load-chunk": 

            let chunk = world.generate_chunk();

            ws.send({
                
            });
        break;

        case "buy-item":
            
        break;

        case "sell-item":

        break;

        case "use-item":

        break;




    }
}