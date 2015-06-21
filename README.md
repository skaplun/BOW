


Channels
    
    USERS
    users.add - add new users
    users.update - update user details
    users.get - login user
    
    MATCH
    match - enter matches pool
    
    GAME
    game - get coords for match
    
 
 Channel struct :
 
 ```
    var channels = {
          
        users : {
            add : 'users.add',
            update : 'users.update',
            get : 'users.get'
        },
        match : 'matchMake',
        game : 'game'
    };
 
 ```
   
    
SEND - send message to backend along a set channel.

```
 function send(socket, channel, message){
            return socket.emit(channel, message);
    }
```

GET - listen


```
    function listen(socket, channel, cb){
        return socket.on(channel, cb)
    }

```