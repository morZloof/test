var user = require(__dirname + '/users.js');
function api(res,req,apiName){
	
	allApiName = apiName.split('/')
	apiName = allApiName[2];
  	
	checkIfLogin()
	function checkIfLogin(){
		if(apiName == "login"){
			var email = req.query.email;
			var password = req.query.password;
			
			user.doLogin(email,password,function(session){
				res.send(session);
			});
		}
		else{
			if (req.headers.cookie == undefined){
				res.send("-1");
				return;
			}
			else{
				var session = (req.headers.cookie.split("session=")[1]);
			}
			
			user.checkSession(session,function(session){
				if(session == true){
					apiSelect()
				}
				else{
					res.send("-1");
				}
			});
		}
	}

	function apiSelect(){
		if(apiName == "nameOfTemps"){
			temp.getNameOfTemps();
		}
		else if(apiName == "news"){
			news.ctor()
		}
		else if(apiName == "comfirm"){
			comfirm.ctor();
		}
		else if(apiName == "nameOfTemps1"){
			temp.getNameOfTemps1();
		}
		else if(apiName == "nameOfFiles"){
			temp.getNamesOfFiles();
		}
		else if(apiName == "deleteTemp"){
			temp.deleteTamp();
		}
		else if(apiName == "addFileToTemp"){
			temp.addFileToTemp();
		}
		else if(apiName == "checkUser"){
			user.checkUser(req,res,function(data){
				res.send(data);
			});
		}
		else if(apiName == "addTemp"){
			temp.addTemp();
		}
		else if(apiName == "nameOfAllFolders"){
			temp.nameOfAllFolders();
		}
		else if(apiName == "addFile"){
			temp.addFile();
		}
		else if(apiName == "getTempsForEdit"){
			temp.getTempsForEdit();
		}
		else if(apiName == "showMaharah"){
			temp.showMaharah();
		}
		else if(apiName == "changeTempName"){
			temp.changeTempName();
		}
		else if(apiName == "editFile"){
			temp.editFile();
		}
		else if(apiName == "deleteFile"){
			temp.deleteFile();
		}
		else if(apiName=="myUser"){
			var session = (req.headers.cookie.split("session=")[1]);
			user.myUser(session,function(data){
				res.send(data);
			})
		}
		else if(apiName=="deleteTempAll"){
			temp.deleteTempAll();
		}
		else if(apiName == "users"){
			if(allApiName[3] == "showusers"){
				user.showUsers(function(data){
					res.send(data);
				})
			}
			else if(allApiName[3] == "createUser"){
				var name= req.query.name;
				var L_name= req.query.L_name;
				var email= req.query.email;
				var password= req.query.password;
				var adminNum = req.query.adminNum;
				var district = req.query.district;
				var school = req.query.school;
				var vclass = req.query.vclass;

				user.createUser(name,L_name,email,password,adminNum,district,school,vclass,function(data){
					res.send(data);
				})
			}
			else if(allApiName[3] == "editUser"){
				var id = req.query.id;
				var L_name= req.query.L_name;
				var name= req.query.name;
				var email= req.query.email;
				var password= req.query.password;
				var adminNum = req.query.adminNum;
				var district = req.query.district;
				var school = req.query.school;
				var vclass = req.query.vclass;
				
				user.editUser(id,L_name,name,email,password,adminNum,district,school,vclass,function(data){
					res.send(data);
				})
			}
			else if(allApiName[3] == "deleteUser"){
				var id = req.query.id;
				user.deleteUser(id,function(data){
					res.send(data);
				})
				
			}
			else{
				res.send(apiName);
			}
		}
		else{
			res.send(apiName);
		}
	}
	
	eval(fs.readFileSync('api/temp.js') + '');
	eval(fs.readFileSync('api/comfirm.js') + '');
	eval(fs.readFileSync('api/news.js') + '');	
}