/********************************************************************************************************
 * This file implements the server side websockets portion of the app.
 ********************************************************************************************************/

let uuid = require('uuid');
let SocketServer = require('ws').Server;


let clients = [];

module.exports = function (server) {
    const wss = new SocketServer({ server });
    wss.on('connection', function (ws) {
        let client_uuid = uuid.v4();
        clients.push({"id": client_uuid, "ws": ws});
        ws.send(JSON.stringify({op: "ident", id: client_uuid}));

        if (global.hasOwnProperty("stocks")) {
            let keys = [...global.stocks.keys()].sort();
            let stocks = [];

            for (let i = 0; i < keys.length; i++) {
                stocks.push({symbol: keys[i], value: global.stocks.get(keys[i])});
            }

            ws.send(JSON.stringify({op: "addAll", payLoad: stocks}));
        }

        ws.on('message', function (message) {
            let msgObj = JSON.parse(message);

            switch (msgObj.op) {
                case "delete":
                    global.stocks.delete(msgObj.stock);
                    sendMsg(msgObj.id, clients, JSON.stringify({op: "delete", stock: msgObj.stock}));
                    break;
                case "add":
                    sendMsg(msgObj.id, clients, JSON.stringify({
                        op: "add",
                        stock: msgObj.stock,
                        payLoad: global.stocks.get(msgObj.stock)
                    }));
                    break;
            }

        });

        ws.on('close', function () {
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].id == client_uuid) {
                    clients.splice(i, 1);
                    break;
                }

                if (clients.length == 0)
                    global.stocks = new Map();
            }
        });
    });
}

function sendMsg(exceptId, clients, message){
    for(let i = 0; i < clients.length; i++){
        if(clients[i].id != exceptId)
            clients[i].ws.send(message);
    }

}


