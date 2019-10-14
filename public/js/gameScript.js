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

  console.log(location.port);

  var socket = io("https://grant-hughes-app.herokuapp.com:" + location.port, { secure: true, reconnect: true, rejectUnauthorized: false });

  var selectedIds = [];
  var selectedClasses = [];

  const lightGrayRGB = 'rgb(235, 235, 235)';
  const darkGrayRGB = 'rgb(169, 169, 169)';
  const redRGB = 'rgb(237, 64, 64)';
  const lightRedRGB = 'rgb(240 ,128 ,128)';
  const blueRGB = 'rgb(93, 98, 227)';
  const lightBlueRGB = 'rgb(100, 149, 237)';
  const blackRGB = 'rgb(128, 128, 128)';
  const lightBlackRGB = 'rgb(158, 158, 158)';

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
        var bomb = false;
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
            bomb = true;
          }
          if(!captainStatus['red'] && !captainStatus['blue']) {
            $('#' + selectedIds[i]).css('background-color', color);
          }    
          $('#' + selectedIds[i]).css('outline', 'none');
          $('#' + selectedIds[i]).addClass('selected');
        }
        if(bomb && redTurn) {
          alert('BLUE WINS');
          return;
        }
        else if(bomb && !redTurn) {
          alert('RED WINS');
          return;
        }
        else if(redScore > 8) {
          alert('RED WINS');
          return;
        }
        else if(blueScore > 7) {
          alert('BLUE WINS');
          return;
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

  function showCells() {
    $('td').each(function(){
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
        bomb = true;
      }
      $('#' + selectedIds[i]).css('background-color', color);
    });
  };

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
      if($('#' + msg['selectedId']).hasClass('highlighted')) {
        selectedIds.pop(msg['selectedId']);
        selectedClasses.pop(msg['selectedClass']);
        if($('#' + msg['selectedId']).hasClass('red') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', redRGB);
        }
        else if($('#' + msg['selectedId']).hasClass('blue') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', blueRGB);
        }
        else if($('#' + msg['selectedId']).hasClass('bomb') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', blackRGB);
        }
        else if((captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', darkGrayRGB);
        }
        else {
          $('#' + msg['selectedId']).css('background-color', 'white');
        }
        $('#' + msg['selectedId']).removeClass('highlighted');
        $('#' + msg['selectedId']).css('outline', 'none');
      }
      else {
        selectedIds.push(msg['selectedId']);
        selectedClasses.push(msg['selectedClass']);
        if($('#' + msg['selectedId']).hasClass('red') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', lightRedRGB);
          $('#' + msg['selectedId']).css('outline', '1px solid yellow');
        }
        else if($('#' + msg['selectedId']).hasClass('blue') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', lightBlueRGB);
          $('#' + msg['selectedId']).css('outline', '1px solid yellow');
        }
        else if($('#' + msg['selectedId']).hasClass('bomb') && (captainStatus['red'] || captainStatus['blue'])) {
          $('#' + msg['selectedId']).css('background-color', lightBlackRGB);
          $('#' + msg['selectedId']).css('outline', '1px solid yellow');
        }
        else {
          $('#' + msg['selectedId']).css('background-color', lightGrayRGB);
        }   
        $('#' + msg['selectedId']).addClass('highlighted');
        //$('#' + msg['selectedId']).css('outline', '1px solid yellow');
      }
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
      if(captainStatus['red'] || captainStatus['blue']) {
        showBoard();
      }
      else {
        $('#select').prop('hidden', true);
      }
    }   
  }

  function showBoard() {
    $("td").each(function() {
      if($(this).hasClass('blank')) {
        color = darkGrayRGB;
      }
      else if($(this).hasClass('red')) {
        color = redRGB;
      }
      else if($(this).hasClass('blue')) {
        color = blueRGB;
      }
      else {
        color = blackRGB;
      }
      $(this).css('background-color', color);
    });
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