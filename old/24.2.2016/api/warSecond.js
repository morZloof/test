var warSecond = new warSecondJs()
function warSecondJs(){
    function ctor(res, req, id) {
		var url = req.originalUrl.split('/')[3];

		if(url == "attack"){
			attack(res, req, id);
		}
        else{
            res.send('error in warSconde.js')
        }
	}
	this.ctor = ctor;
    
    function attack(res,req,id){
        var send_building_id = req.query.send_building_id;
        var get_building_id = req.query.get_building_id;
        
        console.log(get_building_id);
        console.log(send_building_id);
        
        //var sql = 'SELECT * '
        res.send('ok');
    }
}