var notification = new notificationJs();
function notificationJs(){
    function ctor(res,req,id){
        var url = req.originalUrl.split('/')[3];

        if(url == "showNotifications"){
            showNotifications(res,req,id);
        }
        else if(url == "readNotifications"){
            readNotifications(res,req,id);
        }
        else{
            res.send(url);
        }
    }
    this.ctor = ctor;

    function showNotifications(res,req,id){
        var sql = 'SELECT * '
                + 'FROM users '
                + 'WHERE id=' + id + '; '
                
                + 'SELECT * '
                + 'FROM notification '
                + 'WHERE users_id=' + id + ' ORDER BY date DESC;'

        pool.query(sql,function(err,result){
            res.send(result);
        })
    }

    //GET: notification_id
    function readNotifications(res,req,id){

        var notification_id = req.query.notification_id

        var sql = 'UPDATE notification SET '
                    + 'vread=1 '
                + 'WHERE id=' + notification_id + '; ';

        pool.query(sql,function(err,result){
            res.send('success');
        })
    }
}
