$(document).ready(function() {

  var captainStatus = {
      'red': false,
      'blue': false
  }

  var readyStatus = {
      'red': false,
      'blue': false
  }

  var gameStatus = 'home';

  const gameId = $('#gameId').text();

  var socket = io();

  var selectedIds = [];
  var selectedClasses = [];

  const lightGrayRGB = 'rgb(248, 248, 248)';
  const darkGrayRGB = 'rgb(169, 169, 169)';
  const redRGB = 'rgb(237, 64, 64)';
  const blueRGB = 'rgb(93, 98, 227)';
  const blackRGB = 'rgb(128, 128, 128)';

  var redTurn = true;

  var redScore = 0;
  var blueScore = 0;

  socket.on('connect', function() {
      console.log('Connected to Server with game ID: ' + gameId);
      setUp();
  });

  $('#redButton').click(function() {
      readyButtonAction('red');
  })

  $('#blueButton').click(function() {
      readyButtonAction('blue');
  });

  socket.on('redConnect', function(msg) {
      connectAction(msg, 'red');
  });

  socket.on('blueConnect', function(msg) {
      connectAction(msg, 'blue');
  });

  socket.on('redDisconnect', function(msg) {
      disconnectAction(msg, 'red')
  });

  socket.on('blueDisconnect', function(msg) {
      disconnectAction(msg, 'blue')
  });

  socket.on('gameStart', function(msg) {
      gameStartAction(msg);
  });

  socket.on('highlight', function(msg) {
      highlightAction(msg);
  });

  socket.on('select', function(msg) {
      if(msg == gameId) {
        for(var i = 0; i < selectedIds.length; i++) {
          var color = '';
          var victoryMessage = '';
          if(selectedClasses[i] == 'blank') {
            color = darkGrayRGB;
          }
          else if(selectedClasses[i] == 'red') {
            color = redRGB;
            redScore++;
          }
          else if(selectedClasses[i] == 'blue') {
            color = blueRGB;
            blueScore++;
          }
          else {
            color = blackRGB;
          }
          $('#' + selectedIds[i]).css('background-color', color);
          $('#' + selectedIds[i]).addClass('selected');
        }
        redTurn = !redTurn;
        if((captainStatus['red']) && redTurn || (captainStatus['blue'] && !redTurn)) {
          $('#select').prop('disabled', false);
        }
        else {
          $('#select').prop('disabled', true);
        }
        selectedIds = [];
        selectedClasses = [];
      }
  });

  $("td").click(function() {
    if((redTurn && captainStatus['red']) || (!redTurn && captainStatus['blue'])) {
      if(!$(this).hasClass('selected')) {
        socket.emit('highlight', {gameId: gameId, selectedId: $(this).attr('id'), selectedClass: $(this).attr('class')});
      }    
    }  
  });

  $('#button').click(function() {
      socket.emit('gameStart', gameId);
  });

  $('#select').click(function() {
      socket.emit('select', gameId);
  });

  window.onbeforeunload = function(event) {
      if (captainStatus['red']) {
          socket.emit("redDisconnect", gameId);
      } else if (captainStatus['blue']) {
          socket.emit("blueDisconnect", gameId);
      }
  };

  function setUp() {
      readyStatus['red'] = $('#redReady').text() == 'true';
      readyStatus['blue'] = $('#blueReady').text() == 'true';
      gameStatus = $('gameStatus').text();
      if (readyStatus['red']) {
          connectAction(gameId, 'red');
      }
      if (readyStatus['blue']) {
          connectAction(gameId, 'blue');
      }
      if (gameStatus == 'home') {
          enableButtonIfReady();
      }
      if (gameStatus == 'game') {
          gameStartAction();
      }
  }

  function highlightAction(msg) {
    if(msg['gameId'] == gameId) {
      if($('#' + msg['selectedId']).css('background-color') == lightGrayRGB) {
        selectedIds.pop(msg['selectedId']);
        selectedClasses.pop(msg['selectedClass']);
        //const selectedColor = $('#' + msg['selectedId']).css('background-color');
        $('#' + msg['selectedId']).css('background-color', 'rgb(255, 255, 255)');
      }
      else {
        selectedIds.push(msg['selectedId']);
        selectedClasses.push(msg['selectedClass']);
        //const selectedColor = $('#' + msg['selectedId']).css('background-color');
        $('#' + msg['selectedId']).css('background-color', lightGrayRGB);
      }
      // selectedIds.push(msg['selectedId']);
      // selectedClasses.push(msg['selectedClass']);
      // //const selectedColor = $('#' + msg['selectedId']).css('background-color');
      // $('#' + msg['selectedId']).css('background-color', lightGrayRGB);
    }
  }

  function readyButtonAction(primaryColor) {
      const secondaryColor = primaryColor == 'red' ? 'blue' : 'red';
      if (captainStatus[primaryColor]) {
          captainStatus[primaryColor] = false;
          $('#' + primaryColor + 'Button').text("Claim " + primaryColor.charAt(0).toUpperCase() + primaryColor.slice(1) + " Captain");
          if (!readyStatus[secondaryColor]) {
              $('#' + secondaryColor + 'Button').prop('disabled', false);
          }
          socket.emit(primaryColor + 'Disconnect', gameId);
      } else {
          captainStatus[primaryColor] = true;
          $('#' + primaryColor + 'Button').text("Unclaim " + primaryColor.charAt(0).toUpperCase() + primaryColor.slice(1) + " Captain");
          $('#' + secondaryColor + 'Button').prop('disabled', true);
          socket.emit(primaryColor + 'Connect', gameId);
      }
  }

  function connectAction(msg, primaryColor) {
      if (msg == gameId) {
          if (!captainStatus[primaryColor]) {
              $('#' + primaryColor + 'Button').prop('disabled', true);
          }
          $('#' + primaryColor + 'Status').text('Ready');
          readyStatus[primaryColor] = true;
          enableButtonIfReady();
      }
  }

  function disconnectAction(msg, primaryColor) {
      const secondaryColor = primaryColor == 'red' ? 'blue' : 'red';
      if (msg == gameId) {
          if (!captainStatus[secondaryColor]) {
              $('#' + primaryColor + 'Button').prop('disabled', false);
          }
          $('#' + primaryColor + 'Status').text('Not Ready');
          readyStatus[primaryColor] = false;
          disableButton();
      }
  }

  function gameStartAction(msg) {
    if(msg == gameId) {
      gameStatus = 'game';
      $('#homeScreen').prop('hidden', true);
      $('#gameScreen').prop('hidden', false);

      if(captainStatus['red'] && redTurn) {
        $('#select').prop('disabled', false);
      }
      else if(captainStatus['blue'] && !redTurn) {
        $('#select').prop('disabled', false);
      }
    }   
  }

  function enableButtonIfReady() {
      if (readyStatus['red'] && readyStatus['blue']) {
          $('#button').prop('disabled', false);
      }
  };

  function disableButton() {
      $('#button').prop('disabled', true);
  };
});