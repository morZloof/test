io.on('connection', function(socket){
    // console.log('a user connected');
    socket.on('disconnect', function(){
        // console.log('user disconnected');
    });
    
    socket.on('chat message', function(msg){
        var msgText = msg.msg;
        var otherUsersId = msg.otherUsersId;
	    var myId = msg.id;
        
        console.log(otherUsersId)
        io.sockets.in(otherUsersId).emit('chat message', {
            msg: msgText,
            otherUsersId: otherUsersId
        });
        
        addMessageToDb(myId,otherUsersId,msgText);
    });
    
    socket.on('join', function(data){
        var id = data.id;

        socket.join(id);
        // io.sockets.in('1').emit('chat message', {msg: 'hello'});
    });
    
});

function addMessageToDb(myId,otherUsersId,msg){
    async.waterfall([
        function(callback){
            var sql = 'SELECT count(*) AS msgCounter '
            + 'FROM msg '
            + 'WHERE sendId=' + myId + ' AND otherUsers_id=' + otherUsersId +'; '

            pool.query(sql,function(err,result){
                var msgCounter = result[0].msgCounter;
                if(msgCounter<8){
                    callback(null)
                }
                else{
                    var sql = 'DELETE FROM msg '
                            + 'WHERE sendId=1 AND otherUsers_id=1 ORDER BY date LIMIT 1 ; '
                    
                    pool.query(sql);
                    callback(null);
                }
            })
        },
        function(callback){
            var sql = 'INSERT INTO msg '
                + '(msg,otherUsers_id,sendId,date) '
            + 'VALUES'
                + '("' + msg + '",' + otherUsersId + ',' + myId + ',NOW()); ';
    
            pool.query(sql);
        }
    ])
}