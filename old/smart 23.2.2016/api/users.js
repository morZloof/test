var users = new usersJs;
function usersJs(){

	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];
		if(url=="login"){
			login(res,req)
		}
		else if(url=="register"){
			register(res,req);
		}
		else if(url=="getUser"){
			getUser(res,req,id);
		}
		else if(url=="getUserDetailsFromId"){
			getUserDetailsFromId(res,req,id);
		}
		else if(url=="getUserStreets"){
			getUserStreets(res,req,id)
		}
		else if (url=="getUserBuildings"){
			getUserBuildings(res,req,id)
		}
		else if (url=="getUserCity"){
			getUserCity(res,req,id)
		}
		else if(url=="getUserProfit"){
			getUserProfit(res,req,id);
		}
		else if(url=="registerCheck"){
			registerCheck(res,req);
		}
		else if(url=="comfirmRegister"){
			comfirmRegister(res,req,id);
		}
		else if(url=="changeMail"){
			changeMail(res,req);
		}
		else{
			res.send("url");
		}
	}
	this.ctor = ctor;

	function changeMail(res,req){
		var pastEmail = req.query.pastEmail;
		
		async.waterfall([
			function(callback){
				var sql = 'SELECT * '
						+ 'FROM usersPassword '
						+ 'WHERE email="' + pastEmail + '";'
				
				pool.query(sql,function(err,result){
					if(result[0].comfirm==0){
						var id = result[0].id
						callback(null,id)
					}
					else{
						res.send('error: user all ready opend');
					}
				}) 				
			},function(id,callback){
				var sql = 'DELETE FROM usersDetails '
						+ 'WHERE id=' + id +'; ' 
						
						+ 'DELETE '
						+ 'FROM usersPassword '
						+ 'WHERE id="' + id + '" LIMIT 1; '
				
				pool.query(sql,function(err,result){
					register(res,req);
				})
			}
		])
		
	}
	
	function registerCheck(res,req){
		var textCheck = req.query.textCheck;
		var check = req.query.check;
		
		if(check==1){
			var sql = 'SELECT count(*) AS userNameCounter '
					+ 'FROM users '
					+ 'WHERE userName = "' + textCheck + '";'
			
			pool.query(sql,function(err,result){
				res.send(result);
			})	
		}
		else if(check==2){
			var sql = 'SELECT count(*) AS emailCounter '
					+ 'FROM usersPassword '
					+ 'WHERE email = "' + textCheck + '";'
			console.log(sql)
			pool.query(sql,function(err,result){
				res.send(result);
			})
		}
		else{
			res.send('-10');
		}
	}
	this.registerCheck = registerCheck;
	
	//get: pass
	//error: worng password
	//error: user all ready register
	function comfirmRegister(res,req,id){
		var pass = req.query.pass;

		if (pass!=1 && pass!='1'){
			async.waterfall([
				function(callback){
					var sql = 'SELECT * FROM usersPassword WHERE comfirmPass="' + pass + '" LIMIT 1;'

					pool.query(sql,function(err,result){
						if(result.length==0){
							res.send('error: worng password')
						}
						else{
							var id = result[0].id;
							var userName = result[0].userName;
							var comfirm = result[0].comfirm;
							callback(null,id,userName,comfirm);
						}
					})
				},function(id,userName,comfirm,callback){

					if(comfirm==0){
						var sql = 'INSERT INTO users (id,userName,lastLogin) VALUES (' + id + ',"' + userName + '",NOW()); '
						+ 'INSERT INTO mentor (users_id) VALUES (' + id + '); '
						+ 'UPDATE usersPassword set comfirm=1 WHERE id=' + id + ';'

						pool.query(sql,function(err,result){
							updateSession(id,res,req);
						})
					}
					else{
						updateSession(id,res,req)
					}
				}
			])
		}
		else{
			res.send('error: user all ready register');
		}
	}
	this.comfirmRegister = comfirmRegister;
	
	function getUserProfit(res,req,id){
		var sql = 'SELECT * FROM users WHERE id=' + id + ';'
				+ "SELECT * FROM usersBuildings WHERE users_id=" + id + "; " 
		
		pool.query(sql,function(err,result){
			res.send(result)
		})
		
	}
	
	function getUserDetailsFromId(res,req,id) {
		
        var userId = req.query.userId
        
        var sql = 'SELECT * '
                + 'FROM users '
                + 'WHERE id= ' + userId +' ;'
				
		pool.query(sql,function(err,result) {
			res.send(result);
		});
	}
	
	function getUser(res, req, id) {	
		async.waterfall([
			function(callback){

				var sql = 'UPDATE users SET '
						+ 'profit= '
							+ '(SELECT SUM(profit) '
							+ 'FROM usersBuildings '
							+ 'WHERE users_id=' + id + ') '
						+ 'WHERE id= ' + id + '; '

				+ 'SELECT * '
				+ 'FROM users '
				+ 'WHERE id = ' + id + '; '
                

				pool.query(sql,function(err,result){
					var maxMoney = result[1][0].maxMoney;
					var money = result[1][0].money;

					callback(null,result[1],maxMoney,money);
				})
			},
			function (json,maxMoney,money,callback){
				var now = new Date(formatDate(new Date())).getTime()/1000;
				var lastLogin = new Date(formatDate(json[0].lastLogin)).getTime()/1000; 
				var profit = json[0].profit;
				
				var addMoney = formulas.calculateMoney(now,lastLogin,profit);

				var updateMoney = addMoney + money;

				if(updateMoney>maxMoney){
					updateMoney= maxMoney;
				}

				var sql = 'UPDATE users SET '
							+ 'money="' + updateMoney + '", '
							+ 'lastLogin="' + formatDate(new Date()) + '" '
						+ 'WHERE id=' + id + '; '

				pool.query(sql,function(err,result){
					var sql = 'SELECT * FROM users WHERE id = "' + id + '"; '
					+ "SELECT * FROM usersBuildings WHERE users_id=" + id + "; "
					+ "SELECT usersBuildings_id,users_id,type,dateEnd FROM buildingsTime WHERE users_id=" + id + "; "
					+ "SELECT * FROM mentor WHERE users_id=" + id + "; "
					+ "SELECT * FROM usersCitys WHERE users_id = " + id + "; "
                    + "SELECT * FROM notification WHERE users_id=" + id + "; "
					+ "SELECT * FROM factoryReq WHERE send_users_id=" + id + " AND other=0; "
                    + "SELECT * FROM bonus WHERE users_id=" + id + "; ";

					pool.query(sql,function(err,result){
						res.send(result);
					})
				});
			}
		])
	}
    
	function login(res,req){
		var email = req.query.email;
		var password = req.query.password;
		var sql = 'SELECT * FROM usersPassword WHERE email="' + email + '" and password="' + sha256(password) +'"';

		pool.query(sql,function(err,result){
			if(result.length == 0){
				res.send("badUserNameAndPass");
			}
			else{
				var id = result[0]["id"];
				updateSession(id,res,req);
			}
		});
	}
	function updateSession(id,res,req){
		var session = createSession();
		var sql = 'DELETE FROM usersSession WHERE id=' + id + ';' + 
		'INSERT INTO usersSession (id,session) VALUES (' + id + ',"' + session + '")';
		
        var sql1 = 'DELETE FROM vusersSession WHERE id=' + id + ';' + 
		'INSERT INTO vusersSession (id,session) VALUES (' + id + ',"' + session + '")';
        
        res.send(session)
		pool.query(sql);
        //pool1.query(sql1);
	}
	function createSession(){
		function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	
	//url: /api/users/register/?userName=mor&password=1234&email=asd@asd.com
	//get: first_name last_name email password
	//error: user exist
	function register(res,req){

		var userName = req.query.userName;
		var email = req.query.email;
		var password = req.query.password;
		var campion = req.query.campion;
		var comfirmSession = createSession();

		async.waterfall([
			function(callback){ // check length
				if(userName.length<3 || email.length<4 || password.length<4){
					res.send("-10: one of the fields is too short");
				}
				else{
					callback(null);
				}

			},function(callback){ // check if user exist
				var sql = "SELECT count(*) AS emailCounter FROM usersPassword WHERE email='" + email + "';";

				pool.query(sql,function(err,result){
					if(result[0].emailCounter>0){
						res.send("error: user exist");
					}
					else{
						callback(null);
					}
				})
			},function (callback){
				var ip = req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;

				var sql = 'SELECT count(*) AS counter FROM register_ip WHERE ip="' + ip + '" and DATE(date)=DATE(NOW());'

				pool.query(sql,function(err,result){
					if(result[0].counter>6){
						res.send("error: can register just 6 times a day");
					}
					else{
						callback(null,ip)
					}
				})
			},function(ip,callback){
				pool.query(sql,function(err,result){
					var sql = 'INSERT INTO usersPassword '
						+ '(userName,email,password,comfirmPass,registerDate) '
						+ 'VALUES '
						+ '("' + userName + '","' + email + '","' + sha256(password) + '","' + comfirmSession + '",NOW()); '

						+ 'INSERT INTO usersDetails (id,campion,registerDate) '
						+ 'VALUES '
						+ '((SELECT id FROM usersPassword WHERE email="' + email + '"),"' + campion + '",NOW()); '

						+ 'INSERT INTO register_ip '
						+ '(ip,date) '
						+ 'VALUES '
						+ '("' + ip + '",NOW()) '

					pool.query(sql,function(err,result){
						callback(null);
					})
				});
			},function(callback){
				res.send('sucsses');
				// besmartergame
				var url = 'http://' + req.get('Host') + '/register/index.html#pass=' + comfirmSession
				var name = userName;
				var from = 'service@besmarter.co.il';
				var to = email;
				var smtpTransport = nodemailer.createTransport("SMTP",{
					service: "Gmail",
					auth: {
						user: "besmartergame",
						pass: "Oz5411800"
					}
				});

				var mailHTML = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta name="viewport" content="width=device-width"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title></title><style>/* ------------------------------------- GLOBAL ------------------------------------- */*{margin:0;padding:0;text-align: center;direction: rtl;}*{font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;}img{max-width: 100%;}.collapse{margin:0;padding:0;}body{-webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; width: 100%!important; height: 100%;}td{text-align: center;}/* ------------------------------------- ELEMENTS ------------------------------------- */a{color: #2BA6CB;}.btn{text-decoration:none;color: #FFF;background-color: #666;padding:10px 16px;font-weight:bold;margin-right:10px;text-align:center;cursor:pointer;display: inline-block;}p.callout{padding:15px;background-color:#ECF8FF;margin-bottom: 15px;text-align: center;}.callout a{font-weight:bold;color: #2BA6CB;}table.social{/* padding:15px; */background-color: #ebebeb;}.social .soc-btn{padding: 3px 7px;font-size:12px;margin-bottom:10px;text-decoration:none;color: #FFF;font-weight:bold;display:block;text-align:center;}a.fb{background-color: #3B5998!important;}a.tw{background-color: #1daced!important;}a.gp{background-color: #DB4A39!important;}a.ms{background-color: #000!important;}.sidebar .soc-btn{display:block;width:100%;}/* ------------------------------------- HEADER ------------------------------------- */table.head-wrap{width: 100%;}.header.container table td.logo{padding: 15px;}.header.container table td.label{padding: 15px; padding-left:0px;}/* ------------------------------------- BODY ------------------------------------- */table.body-wrap{width: 100%;}/* ------------------------------------- FOOTER ------------------------------------- */table.footer-wrap{width: 100%;clear:both!important;}.footer-wrap .container td.content p{border-top: 1px solid rgb(215,215,215); padding-top:15px;}.footer-wrap .container td.content p{font-size:10px;font-weight: bold;}/* ------------------------------------- TYPOGRAPHY ------------------------------------- */h1,h2,h3,h4,h5,h6{font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; line-height: 1.1; margin-bottom:15px; color:#000;}h1 small, h2 small, h3 small, h4 small, h5 small, h6 small{font-size: 60%; color: #6f6f6f; line-height: 0; text-transform: none;}h1{font-weight:200; font-size: 44px;}h2{font-weight:200; font-size: 37px;}lead{font-weight:500;}{h3{font-weight:500; font-size: 27px;}h4{font-weight:500; font-size: 23px;}h5{font-weight:900; font-size: 17px;}h6{font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;}.collapse{margin:0!important;}p, ul{margin-bottom: 10px; font-weight: normal; font-size:14px; line-height:1.6;}p.lead{font-size:17px;}p.last{margin-bottom:0px;}ul li{margin-left:5px;list-style-position: inside;}/* ------------------------------------- SIDEBAR ------------------------------------- */ul.sidebar{background:#ebebeb;display:block;list-style-type: none;}ul.sidebar li{display: block; margin:0;}ul.sidebar li a{text-decoration:none;color: #666;padding:10px 16px;/* font-weight:bold; */margin-right:10px;/* text-align:center; */cursor:pointer;border-bottom: 1px solid #777777;border-top: 1px solid #FFFFFF;display:block;margin:0;}ul.sidebar li a.last{border-bottom-width:0px;}ul.sidebar li a h1,ul.sidebar li a h2,ul.sidebar li a h3,ul.sidebar li a h4,ul.sidebar li a h5,ul.sidebar li a h6,ul.sidebar li a p{margin-bottom:0!important;}/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */.container{display:block!important;max-width:600px!important;margin:0 auto!important; /* makes it centered */clear:both!important;}/* This should also be a block element, so that it will fill 100% of the .container */.content{padding:15px;max-width:600px;margin:0 auto;display:block;}.content table{width: 100%;}/* Odds and ends */.column{width: 300px;float:left;}.column tr td{padding: 15px;}.column-wrap{padding:0!important; margin:0 auto; max-width:600px!important;}.column table{width:100%;}.social .column{width: 280px;min-width: 279px;float:left;}/* Be sure to place a .clear element after each set of columns, just to be safe */.clear{display: block; clear: both;}/* ------------------------------------------- PHONEFor clients that support media queries.Nothing fancy. -------------------------------------------- */@media only screen and (max-width: 600px){a[class="btn"]{display:block!important; margin-bottom:10px!important; background-image:none!important; margin-right:0!important;}div[class="column"]{width: auto!important; float:none!important;}table.social div[class="column"]{width:auto!important;}}</style></head> <body bgcolor="#FFFFFF"><table class="head-wrap" bgcolor="#1e798e"><tr><td></td><td align="center" class="header container"><div class="content"><table bgcolor="#1e798e"><tr><td><img src="http://www.besmarter.co.il/www/images/header/logo.png" style="width: 20%"/></td></tr></table></div></td><td></td></tr></table><table class="body-wrap"><tr><td></td><td class="container" bgcolor="#FFFFFF"><div class="content"><table><tr><td><h3>ברוך הבא, '+userName+'!</h3><p class="lead">הרשמתך למשחק Be Smarter הסתיימה בהצלחה!</p><p class="lead"><a href="'+url+'">לחץ כאן לאשר את חשבונך במשחק</a><br>או הזן את הקוד באתר:<br> '+comfirmSession+'</p><p><img src="http://www.besmarter.co.il/login/images/bg.jpg" style="width: 20%"/></p><p class="callout"> <a href="'+url+'">לחץ כאן בשביל לסיים את ההרשמה!</a></p><br/><br/></td></tr></table></div></td><td></td></tr></table></body></html>'

				var mailOptions = {
					from: from,
					to: to,
					subject: userName+', נא אשר את הרשמתך למשחק Be Smarter' ,
					html: mailHTML
				}
				smtpTransport.sendMail(mailOptions, function(error, response){
					if(error){
						console.log(error);
					}else{
						// res.redirect('/');
					}
				});
			}
		])
	}
	
	function getUserPass(id){
		sql="SELECT * FROM usersPassword WHERE id='" + id + "'";
		pool.query(sql,function(err,result){
			var pass=result[0];
		})
	}
	
	//http://localhost:3000/api/users/getUserStreets
	// StreetId
	function getUserStreets(res,req,id){
		var sql = "SELECT * FROM usersStreets JOIN telAviv WHERE usersStreets.users_id='" + id + "' AND usersStreets.streets_id=telAviv.id group by streets_id";
		pool.query(sql,function(err,result){
			if (err)
			{
				// console.log("error getUserStreets");
			}
			else
			{
				res.send(result);
			}
		})
	}
	// /api/users/getUserBuilding
	function getUserBuildings(res,req,id)
	{
		var sql = "SELECT * FROM usersBuildings WHERE users_id=" + id + ";";

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

	//http://localhost:3000/api/users/getUserCity
	function getUserCity(res,req,id)
	{
		var sql = "SELECT * FROM usersCitys WHERE usersCitys.users_id='"+id+"' group by cityName;";
		pool.query(sql,function(err,result)
		{
			if (err) {
				// console.log("error getUserBuilding");
			}
			else
			{
				res.send(result);
			}
		})
	}
}
