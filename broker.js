const aedes=require('aedes')();const {WebSocketServer,createWebSocketStream}=require('ws');
const wss=new WebSocketServer({port:8888});wss.on('connection',ws=>aedes.handle(createWebSocketStream(ws)));
console.log('broker up');
