const express = require('express');
const path = require('path');
const http = require('http');
// const socketIO = require('socket.io'); 

const PORT = 4000;

const app = express();
const server = app.listen(PORT); 
// const io = socketIO(server);

const games = new Map();
process.env.games = JSON.stringify(Array.from(games.entries()));

console.log('Listening on port ' + PORT + '...');

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/routes'));

// io.on('connection', (socket)=>{
//     console.log('New user connected');
//     socket.on('redConnect', function(msg){
//         console.log("Red captain connected: " + msg);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['redConnect'] = true;
//         game['redReady'] = true;
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         console.log(msg);
//         io.emit('redConnect', msg);
//     });
//     socket.on('blueConnect', function(msg){
//         console.log("Blue captain connected: " + msg);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['blueConnect'] = true;
//         game['blueReady'] = true;
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         console.log(msg);
//         io.emit('blueConnect', msg);
//     });
//     socket.on('redDisconnect', function(msg) {
//         console.log("Red captain disconnected: " + msg);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['redConnect'] = false;
//         game['redReady'] = false;
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         io.emit('redDisconnect', msg);
//     });
//     socket.on('blueDisconnect', function(msg) {
//         console.log("Blue captain disconnected: " + msg);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['blueConnect'] = false;
//         game['blueReady'] = false;
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         io.emit('blueDisconnect', msg);
//     });
//     socket.on('gameStart', function(msg) {
//         console.log("Select mode: " + msg);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['gameStatus'] = 'game';
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         io.emit('gameStart', msg);
//     });
//     socket.on('highlight', function(msg) {
//         console.log("Highlight cell: " + msg['gameId']);
//         const games =  new Map(JSON.parse(process.env.games));
//         const game = games.get(msg['gameId']);
//         if(game == null) {
//             console.error('Game null');
//             return;
//         }
//         game['selectedId'] = msg['selectedId'];
//         game['selectedClass'] = msg['selectedClass'];
//         games.set(msg, game);
//         process.env.games = JSON.stringify(Array.from(games.entries()));
//         io.emit('highlight', msg);
//     });
//     socket.on('select', function(msg) {
//         console.log("Select cell: " + msg);
//         // const games =  new Map(JSON.parse(process.env.games));
//         // const game = games.get(msg['gameId']);
//         // if(game == null) {
//         //     console.error('Game null');
//         //     return;
//         // }
//         // game['selectedId'] = msg['selectedId'];
//         // game['selectedClass'] = msg['selectedClass'];
//         // games.set(msg, game);
//         // process.env.games = JSON.stringify(Array.from(games.entries()));
//         io.emit('select', msg);
//     });
// });