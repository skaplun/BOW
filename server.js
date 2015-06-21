//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');


var socketio = require('socket.io');
var express = require('express');


var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var waitingSockets = [];

/*
 * matches = {
 *   id = {
 *    players :[],
 *     moves : []
 *   }
 * }
 *
 */

var matches = {
};

/*
 *
 * All possible game channels
 *
 */
   
var channels = {
  users : {
    add : 'users.add',
    update : 'users.update',
    get : 'users.get'
  },
  match : 'matchMake',
  game : 'game'
  
};


io.on('connection', function (socket) {
  
    

    socket.on('disconnect', function () {
        disconnect(socket);
    });
    
    
    // listen(socket, channels.users.add, addUser)
    // listen(socket, channels.users.update, updateUser)
    // listen(socket, channels.users.get, getUser)
    
    listen(socket, channels.match, function(data){
      matchMake(socket, data);
    });
    
    listen(socket, channels.game, function(data) {
        gameMake(socket, data);
    });
    
    
  });



function matchMake(socket) {
  
  var obj, matchId;
  

  waitingSockets.push(socket);
  
  if (waitingSockets.length < 2) {
    
    return socket.emit(channels.match, { response: 'ok', matchId: 'please Wait' });
    
  } else {
    
    var players = getRandomSubarray(waitingSockets, 2);
    
    obj = {};
    matchId = guid();
    obj['players'] = players;
    obj['moves'] = {};
    matches[matchId] = obj;
    
    players.forEach(function(player) {
      
        safeSplice(waitingSockets, player);
        
        return sendToSocket(player, channels.match, { response: 'ok', matchId: matchId });
        
    })
    
  }
  
}

function gameMake(socket, data) {
  
  var match = matches[data.matchId], obj, currntMove;
   
  
  if(!match) 
      return sendToSocket(socket, channels.game, {response: 'error', text: 'no match in progress'})

  
  currntMove = Object.keys(match.moves);
   
  if(!currntMove.length) {
    
    obj = {};
    
    obj[socket.id] = data.position;
    
    match['moves'] = obj;
    
  }else{
    
    
     //socket sent two updates before partner sent 1
    if(currntMove[0] === socket.id) {
      
        return terminateMatch(data.matchId, 'turns sent out of sync, terminating match');
        
    }
    
    match.players.forEach(function(player) {
      
      //second socket, should get first
      if(player.id === socket.id) {
        var k = Object.keys(match.moves)[0];
        
        return sendToSocket(socket, channels.game, {response: 'ok', position:  match.moves[k]});
        
      }else{

        return sendToSocket(player, channels.game, {response: 'ok', position:  data.position});
      }
      
    })

    match.moves = {};
    
  }

}

function terminateMatch (matchId, text) {
  
  var match = matches[matchId];
  
   match.players.forEach(function(player){
     
        return sendToSocket(player, channels.game, {response: 'error', text : text});
        
      })
  
  delete matches[matchId]
  
}

function disconnect (socket) {
  
  if(waitingSockets.length) {
    
      waitingSockets.forEach(function(s) {
         
        if(s.id === socket.id) {
          
          safeSplice(waitingSockets, s);
        } 
        
      });
    
  }

}

function getRandomSubarray(arr, size) {
  
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    
    while (i--) {
      
        index = Math.floor((i + 1) * Math.random());
        
        temp = shuffled[index];
        
        shuffled[index] = shuffled[i];
        
        shuffled[i] = temp;
    }
    
    return shuffled.slice(0, size);
}

function safeSplice(arr, item) {
  
    return arr.indexOf(item) > -1 ?
              arr.splice(arr.indexOf(item), 1) : false;
}

function guid() {
  
  function s4() {
    
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function listen(socket, channel, cb) {
    return socket.on(channel, cb)
};

function sendToSocket(socket, channel, message) {
      return socket.emit(channel, message);
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {

  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);

  
});
