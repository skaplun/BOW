
Example:
https://bowgame-skaplun1.c9.io/

client side example source: https://github.com/skaplun/BOW/blob/master/client/index.html

Get started:
 1. install nodejs + npm
 2. git clone repository to location
 3. go to location in terminal
 4. enter commands:
    1. npm install
    2. node server.js



Channels

    'match' - enter/leave matches pool
    'game' - send/get coords for of boats
  

socket methods: 

```
Send:
socket.emit(channel, msgObj);


listen:

socket.on(channel, callbackFunction);

```

client side api
   1. channel: match
      1. send 
         1. join msg : {status: 'join'}
         2. leave msg : {status: 'die'}
      2. listen to match id
        1. 0 - no opponent
        2. serial - game start
        3. disconnect success
    2. channel: game
      1. send
         1. coords msg: { matchId : serial, position : coords obj }
     2. listen to coords msg
        1 coords response: {response: 'ok', position:  opponent's coords obj}


server throws error and terminates game if one side sends two turns in a row



