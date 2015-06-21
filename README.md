


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
   
    
Send - send message to backend along a set channel.

```
    @socket  - {Object} : Socket 
    @channel - {String}
    @cb      - {Function}  
    
    function send(socket, channel, message){
        return socket.emit(channel, message);
    }
```

Listen - listen to a channel using callback sent as 3rd argument


```
    @socket  - {Object} : Socket 
    @channel - {String}
    @cb      - {Function}  
    
    function listen(socket, channel, cb){
        return socket.on(channel, cb)
    }

```