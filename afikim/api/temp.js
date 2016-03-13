var temp = new tempJs()
function tempJs(){
	
	function getNameOfTemps(){
		var connection = createConnection();
		var sql = 'SELECT * FROM temps WHERE mainTemp="0";';
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		});
		
	}
	this.getNameOfTemps = getNameOfTemps;
	function getNameOfTemps1(){
		var tempName = req.query.temp;
		
		var connection = createConnection();
		var sql = 'SELECT * FROM temps WHERE mainTemp="' + tempName + '";';
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		});
	}
	this.getNameOfTemps1 = getNameOfTemps1;
	
	function nameOfAllFolders(){
		var connection = createConnection();
		var sql = 'SELECT * FROM temps ORDER BY mainTemp;';
		console.log(sql)
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		});
	}
	this.nameOfAllFolders = nameOfAllFolders;
	function changeTempName(){
		var id = req.query.id;
		var newName = req.query.newName;

		var connection = createConnection();
		
		var sql = "SELECT * FROM temps WHERE id=" + id + ";";
		connection.query(sql,function(err,result){
			var mainTemp = result[0]["mainTemp"];
			var tempName = result[0]["temp"];
			
			if(mainTemp=="0"){
				var sql = "SELECT * FROM temps WHERE mainTemp='0' AND temp='" + newName + "';";
				connection.query(sql,function(err,result){
					if(result.length==0){
						var sql = "UPDATE temps SET temp='" + newName + "' WHERE id=" + id + ";";
						connection.query(sql);
						var sql = "UPDATE temps SET mainTemp='" + newName + "' WHERE mainTemp='" + tempName + "';";
						connection.query(sql);
						connection.end()
					}
				})
			}
			else{
				var sql = "SELECT * FROM temps WHERE mainTemp='" + mainTemp + "' AND temp='" + newName + "';";
				connection.query(sql,function(err,result){
					if(result.length==0){
						console.log(1)
						var sql = "UPDATE temps SET temp='" + newName + "' WHERE id=" + id + ";";
						connection.query(sql);		
						connection.end()
					}
				})
			}
		})
	}
	this.changeTempName = changeTempName;
	function addFileToTemp(){
		var temp_id = req.query.temp_id;
		var filePath = req.query.filePath;
		var pathNumber = req.query.pathNumber;
		
		var fileNewName = encodeURIComponent(filePath);
		
		var connection = createConnection();
	
		if(pathNumber==1){
			var sql = 'UPDATE files set filePath1="' + fileNewName + '" WHERE id="' + temp_id + '";';
		}
		else if(pathNumber==2){
			var sql = 'UPDATE files set filePath2="' + fileNewName + '" WHERE id="' + temp_id + '";';
		}
		else if(pathNumber==3){
			var sql = 'UPDATE files set filePath3="' + fileNewName + '" WHERE id="' + temp_id + '";';
		}
		else if(pathNumber==4){
			var sql = 'UPDATE files set filePath4="' + fileNewName + '" WHERE id="' + temp_id + '";';
		}
		connection.query(sql);
		fs.rename(__dirname + '/files/' + filePath, __dirname + '/files/' + fileNewName, function (err) {});
		res.send("a");
		connection.end();
	}
	this.addFileToTemp = addFileToTemp;
	
	function showMaharah(){
		var id = req.query.id;
		var connection = createConnection();
		var sql = 'SELECT * FROM files WHERE id="' + id + '";';
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		});
	}
	this.showMaharah = showMaharah;
	function getNamesOfFiles(){
		var tempId = req.query.tempId;

		var connection = createConnection();
		var sql = 'SELECT * FROM files WHERE temps_id=' + tempId + ';';		
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end();
		})
	}
	this.getNamesOfFiles = getNamesOfFiles;
	
	function getTempsForEdit(){
		var tempId = req.query.temp_id;
		var connection = createConnection();

		var sql = 'SELECT * FROM temps WHERE id=' + tempId + ';';		
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		})
	}
	this.getTempsForEdit = getTempsForEdit;
	
	function deleteTempAll(){
		var id = req.query.id;
		var sql = 'SELECT * FROM files WHERE id=' + id + ';';		
		var connection = createConnection();

		connection.query(sql,function(err,result){
			var filePath1 = (result[0]["filePath1"]);
			var filePath2 = (result[0]["filePath2"]);
			var filePath3 = (result[0]["filePath3"]);
			var filePath4 = (result[0]["filePath4"]);
			
			var sql = 'DELETE FROM files WHERE id=' + id + ';';		
			connection.query(sql);
			connection.end();
			
			if(filePath1.length > 0){
				var filePath = __dirname + "/files/" + filePath1; 
				fs.unlinkSync(filePath);
			}
			if(filePath2.length > 0){
				var filePath = __dirname + "/files/" + filePath2;
				fs.unlinkSync(filePath);
			}
			if(filePath3.length > 0){
				var filePath = __dirname + "/files/" + filePath3; 
				fs.unlinkSync(filePath);
			}
			if(filePath4.length > 0){
				var filePath = __dirname + "/files/" + filePath4; 
				fs.unlinkSync(filePath);
			}
			
			res.send(result);
		})
	}
	this.deleteTempAll = deleteTempAll;
	
	function editFile(){
		var title = req.query.title;
		var text = req.query.text;
		var temp_id = req.query.temp_id;
		var id = req.query.id;

		var connection = createConnection();
		var sql = "UPDATE files SET "+
					"name='" + title + "',"+
					"text='" + text + "',"+
					"temps_id='" + temp_id + "'"+
					"WHERE id=" + id + ";";	
		console.log(sql);
		connection.query(sql,function(err,result){
			res.send("zloof");
			connection.end();
		})
	}
	this.editFile = editFile;
	
	function deleteFile(){
		var id = req.query.id;
		var fileNumber = req.query.fileNumber;
		
		var connection = createConnection();

		var sql = 'SELECT * FROM files WHERE id=' + id;
		connection.query(sql,function(err,result){
			
			if(fileNumber==1){
				var sql = 'UPDATE files set filePath1="" WHERE id='+ id;
				var filePath = (result[0].filePath1);
			}
			else if(fileNumber==2){
				var sql = 'UPDATE files set filePath2="" WHERE id='+ id;
				var filePath = (result[0].filePath2);
			}
			else if(fileNumber==3){
				var sql = 'UPDATE files set filePath3="" WHERE id='+ id;
				var filePath = (result[0].filePath3);
			}
			else if(fileNumber==4){
				var sql = 'UPDATE files set filePath4="" WHERE id='+ id;
				var filePath = (result[0].filePath4);
			}
			connection.query(sql);
			res.send(result);
			connection.end();
			
			var filePath = __dirname + "/files/" + filePath; 
			fs.unlinkSync(filePath);
		})
	}
	this.deleteFile = deleteFile
	
	function addFile(){
		var tempMainId = req.query.tempMainId;
		var tempName = req.query.tempName;
		var fileText = req.query.fileText;
		var filePath1 = req.query.filePath1;
		var filePath2 = req.query.filePath2;
		var filePath3 = req.query.filePath3;
		var filePath4 = req.query.filePath4;
	
		var connection = createConnection();
		var sql = 'INSERT INTO files (filePath1, name,text,temps_id,filePath2,filePath3,filePath4,change1) VALUES ("' + filePath1 + '", "' + tempName + '","' + fileText + '","' + tempMainId +'","' + filePath2 + '", "' + filePath3 + '", "' + filePath4 + '",0);';
		connection.query(sql);

		var sql = 'SELECT * FROM files WHERE name="' + tempName + '";';
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end();
		});
		// res.send("a");
	}
	this.addFile = addFile;
	
	function addTemp(){
		
		var connection = createConnection();
		
		var tempMain = req.query.tempMain;
		var tempName = req.query.tempName;
		
		var sql = 'SELECT * FROM temps WHERE temp="' + tempName + '";';
		connection.query(sql,function(err,result){
			if(result.length==0){
				var sql = 'INSERT INTO temps (mainTemp,temp) values ("' + tempMain +'","' + tempName + '");';
				connection.query(sql);		
				connection.end();
			}
		})

		getNameOfTemps();
	}
	this.addTemp = addTemp;
	
	function deleteTamp(){
		var tempName = req.query.temp;
		var path = __dirname + '/tpasim/' + temp;
		
		var connection = createConnection();
		var sql = 'DELETE FROM temps WHERE temp="' + tempName + '";' + 
					'DELETE FROM temps where mainTemp!="0" and mainTemp="' + tempName + '"';
		connection.query(sql);
		connection.end();
		
		// deleteFolderRecursive(path);
		res.send(tempName);
	}
	this.deleteTamp = deleteTamp;
	
	// function deleteFolderRecursive(path) {
	//     var files = [];
	//     if( fs.existsSync(path) ) {
	//         files = fs.readdirSync(path);
	//         files.forEach(function(file,index){
	//             var curPath = path + "/" + file;
	//             if(fs.lstatSync(curPath).isDirectory()) {
	//                 deleteFolderRecursive(curPath);
	//             } else {
	//                 fs.unlinkSync(curPath);
	//             }
	//         });
	//         fs.rmdirSync(path);
	//     }
	// };
}
