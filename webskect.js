const ws = require("nodejs-websocket")
const moment=require('moment')
console.log("开始建立连接....")

let user = [];
function boardcast(obj) {
    server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify(obj))
    })
}

function getDate() {
    return moment().format('YYYY-MM-DD HH::mm:ss');
}


var server = ws.createServer(function (conn) {
    conn.on("text", function (obj) {
        let date=getDate()
        console.log("连接成功")
        obj = JSON.parse(obj);
        if (obj.type === 1) {
            user.push({
                nickname:obj.nickname
            });
            boardcast({
                type: 1,
                Date: getDate(),
                msg: obj.nickname + "加入聊天室",
                user: user,
                uid: obj.uid,
                nickname: obj.nickname
            });
        } else {
            boardcast({
                type: 2,
                date: getDate(),
                msg: obj.msg,
                uid: obj.uid,
                nickname: obj.nickname
            });
        }
    })
    
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8001)

console.log("websocket建立完毕")