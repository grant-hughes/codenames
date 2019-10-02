

// $(document).ready(function() {

//   var socket=io();    
//   // make connection with server from user side 
//   socket.on('connect', function(){ 
//     console.log('Connected to Server') 
//   }); 

//   const status = $('#status').text();
//   if(status.includes('red')) {
//     console.log('red connected');
//     socket.emit('redConnect', status.replace('red', ''));
//   }

//   if(status.includes('blue')) {
//     console.log('blue connected');
//     socket.emit('blueConnect', status.replace('blue', ''));
//   }

//   window.onbeforeunload = function (event) {
//     if(status.includes('red')) {
//       socket.emit("redDisconnect", status.replace('red', ''));
//     }
//     else if(status.includes('blue')) {
//       socket.emit("blueDisconnect", status.replace('blue', ''));
//     }
//   };
  
// });

  