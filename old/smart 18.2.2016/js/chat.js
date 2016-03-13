io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
    
    socket.on('join', function(data){
        var id = data.id;
        socket.join(id);
        console.log(1)
        console.log(1)
        console.log(1)
        io.sockets.in('1').emit('chat message', {msg: 'hello'});
    });
});