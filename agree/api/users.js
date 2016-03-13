var users = new usersJs();
function usersJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "login"){
			login(res,req);
		}
		else if(url == "getMyUser"){
			getMyUser(res,req,id);
		}
		else if(url == "getProfile"){
			getProfile(res,req,id);
		}
		else if(url == "register"){
			register(res,req,id);
		}
		else if(url == "registerFirstSide"){
			registerFirstSide(res,req,id);
		}
		else if(url == "openDisputeSecodeSide"){
			openDisputeSecodeSide(res,req,id);
		}
		else if(url == "openDisputeFirstSide"){
			openDisputeFirstSide(res,req,id);
		}
		else if(url == "registerSecondSide"){
			registerSecondSide(res,req,id);
		}
		else if(url == "checkDisputePass"){
			checkDisputePass(res,req,id);
		}
		else if(url == "mediatorRegister"){
			mediatorRegister(res,req,id);
		}
        else if(url == 'updateLevel'){
            updateLevel(res,req,id);
        }
		else{
			res.send(url)
		}
	}
	this.ctor = ctor;

    function updateLevel(res,req,id){
        var sql ='SELECT * FROM users WHERE id=' + id + '; '

        pool.query(sql,function(err,result){
            var points = result[0].points;
            var level = result[0].level;
            
             if((points>10 && points<51) && level==0){
                var sql = 'INSERT INTO notification '
                            + '(users_id,text_type,image_type,date) '
                        + 'VALUES '
                            + '(' + id + ',200,3,now()); '
                            
                        + 'UPDATE users SET '
                            +   'level=1 '
                        + 'WHERE id=' + id + '; '

                pool.query(sql)
            }
            else if((points>50 && points<101) && level==1){
                var sql = 'INSERT INTO notification '
                            + '(users_id,text_type,image_type,date) '
                        + 'VALUES '
                            + '(' + id + ',201,3,now()); '
                            
                        + 'UPDATE users SET '
                            +   'level=2 '
                        + 'WHERE id=' + id + '; '

                pool.query(sql)
            }
            else if(points>100 && level==2){
                var sql = 'INSERT INTO notification '
                            + '(users_id,text_type,image_type,date) '
                        + 'VALUES '
                            + '(' + id + ',202,3,now()); '
                            
                        + 'UPDATE users SET '
                            +   'level=3 '
                        + 'WHERE id=' + id + '; '

                pool.query(sql)
            }
        })
        
        res.send('success');
    }
    
	function getProfile(res,req,id){
		var sql = 'SELECT * '
				+ 'FROM users '
				+ 'WHERE id=' + id + '; '

				+ 'SELECT * '
				+ 'FROM dispute '
				+ 'WHERE parties1_id=' + id + ' OR parties2_id=' + id + ';';

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

	function openDisputeSecodeSide(res,req,id){
		var name = req.query.name;
		var email = req.query.email;
		var password = req.query.password;

		var parties2_text = req.query.parties2_text;
		var disputeUserName = req.query.disputeUserName;
		var pass = req.query.pass;

		async.waterfall([
			function(callback){
				var sql = 'SELECT count(*) AS counter '
					+ 'FROM disputeStart '
					+ 'WHERE pass=' + pass + ';';

				pool.query(sql,function(err,result){
					if(result[0]['counter']==0){
						res.send("error: not dispute")
					}
					else{
						callback(null)
					}
				})

			},function(callback){
				var sql = 'UPDATE disputeStart SET '
					+ 'parties2_name="' + disputeUserName + '", '
					+ 'parties2_text="' + parties2_text + '", '
					+ 'parties2_id=' + id + ' '
					+ 'WHERE pass= ' + pass + ';'

				pool.query(sql,function(err,result){
					callback(null)
				})
			},function(callback){
				var sql = 'SELECT * '
					+ 'FROM disputeStart '
					+ 'WHERE pass="' + pass + '";'

				pool.query(sql,function(err,result){
					var json = result[0];
					var title = json.title;
					var parties1_name = json.parties1_name;
					var parties2_name = json.parties2_name;
					var parties1_text = json.parties1_text;
					var parties2_text = json.parties2_text;
					var parties1_id = json.parties1_id;
					var parties2_id = json.parties2_id;

					var sql = 'INSERT INTO dispute '
						+ '(title,parties1_id,parties1_name,parties1_FirstTextProblem,parties2_id,parties2_name,parties2_FirstTextProblem,mediator_id,mediator_name,startDate) '
						+ 'VALUE'
						+ '("' + title + '",' + parties1_id + ',"' + parties1_name + '","' + parties1_text + '",' + parties2_id +',"' + parties2_name + '","' + parties2_text + '",3,"Agree Online",NOW()); '

						+ 'INSERT INTO notification '
						+ '(users_id,other,other_name,other_name1,text_type,image_type,date) '
						+ 'VALUES '
						+ '(3,(SELECT max(id) FROM dispute),"' + parties1_name + '","' + parties2_name + '",1,3,NOW()); '

						+ 'DELETE FROM disputeStart '
						+ 'WHERE pass= ' + pass + ' LIMIT 1;'

					pool.query(sql);
					res.send('ok');
				})
			}
		])
	}

	//GET: secondSide_name,secondSide_email,disputeTitle,parties1_text,disputeUserName
	function openDisputeFirstSide(res,req,id){
		var secondSide_name = req.query.secondSide_name;
		var secondSide_email = req.query.secondSide_email;

		var disputeTitle = req.query.disputeTitle;
		var parties1_text = req.query.parties1_text;
		var disputeUserName = req.query.disputeUserName;
		var pass = Math.floor((Math.random() * 10000) + 1);;

		async.waterfall([
			function(callback){
				var sql = 'INSERT INTO disputeStart '
						+ '(parties1_id,parties1_name,parties1_text,title,parties2_name,pass,date)'
						+ 'VALUES '
						+ '(' + id + ',"' + disputeUserName + '","' + parties1_text + '","' + disputeTitle + '","' + secondSide_name + '",' + pass + ',NOW())'

				secondSide_name = decodeURIComponent(secondSide_name);
				disputeTitle = decodeURIComponent(disputeTitle);
				disputeUserName = decodeURIComponent(disputeUserName);

				//var url = 'http://' + req.get('Host') + '/#register?pass=' + pass
				//var mailHTML = '<div style="text-align:right;float:right;width:100%;">'
				//	+ secondSide_name + ' שלום<br>'
				//	+ ' .ניתן לפתור באמצעותנו את המחלוקת איתך ' + secondSide_name + ' מכיוון שלדעת ,Agree Online, המייל הזה נשלח אליך מאיתנו<br>'
				//	+ '."' + disputeTitle + '" המחלוקת היא בנושא ,' + name + ' לדברי <br>'
				//	+ '.היא רשת חברתית המסייעת ליישב מחלוקות בהסכמה, בדרך מהירה וידידותית Agree Online <br>'
				//	+ '.להחליט על הדרך הנכונה לפתרון המחלוקת, בהובלת מנחה ניטרלי ובסיוע של יועצים מקהל המשתמשים ' + secondSide_name + ' תאפשר לך ול Agree Online <br><br>'
				//	+ '?למה לך ליישב את המחלוקת באמצעותנו'
				//	+ '<ul style="direction:rtl">'
				//	+ '<li>כי זה חינם!</li>'
				//	+ '<li>כי המערכת היא דיסקרטית ומאפשרת לך חשיפה מצומצמת.</li>'
				//	+ '<li>כי אנחנו נפעיל עבורך מאגר רחב של אנשים יצירתיים במטרה למצוא פתרון מהיר ויעיל למחלוקת, שיהיה טוב לשני הצדדים.</li>'
				//	+ '<li>כי המערכת היא פשוטה, שקופה ולגמרי ניטרלית.</li>'
				//	+ '<li>כי כל ההליך אצלנו כפוף לחלוטין להסכמה שלך ולא יקרה בו דבר בלי הסכמתך.</li>'
				//	+ '</ul>'
				//	+ '.ובעיקר, כי אנחנו נהיה שם לאורך כל הדרך ונסייע עד שתגיעו לפתרון מוסכם של המחלוקת<br>'
				//	+ '.כדי להתחיל עכשיו לפתור את המחלוקת יש ללחוץ <a href="' + url + '">כאן</a><br>'
				//	+ '.להתרשמות מהמערכת, ניתן ללחוץ <a href="' + req.get('Host') + '">כאן</a><br>'
				//	+ '.ניתן להתחיל את התהליך לסיום המחלוקת גם באמצעות הזנת המספר ' + pass + ' בטופס ההרשמה<br><br>'
				//	+ '<div style="direction:rtl">אם יש לך שאלות, ניתן לפנות אלינו במייל: admin@agree-online.com </div>'
				//	+ '<div style="direction:rtl">צוות Agree Online</div>'
				//	+ '</div>';

				pool.query(sql,function(err,result){
					res.send('success');
				})

				var sql = 'select * from users where id=' + id +';';
				pool.query(sql,function(err,result){

					var email= result[0].email
					var name1= result[0].firstName;

					var mailHTML = '<div style="text-align:right;float:right;width:100%;direction:rtl">'
						+ 'פתיחת סכסוך חדש<br>'
						+'המייל של  הצד המזמין:' + email + '<br>'
						+'השם של הצד המזמין:'  + decodeURIComponent(name1) +'<br>'
						+'המייל של הצד המוזמן:'  + secondSide_email +'<br>'
						+'השם של הצד המוזמן:'  + decodeURIComponent(secondSide_name) +'<br>'
						+'נושא המחלוקת:'  + decodeURIComponent(disputeTitle) +'<br>'
						+'סיפור המחלוקת:'  + decodeURIComponent(parties1_text) +'<br>'
						+'הכינוי של הצד המזמין:'  + decodeURIComponent(disputeUserName) +'<br>'
						+'   סיסמה:'  + pass +'<br>'
						+ '</div>'

					var name = decodeURIComponent(name);
					var userName = decodeURIComponent(name);
					var from = 'invitation@agree-online.com';
					//var to = secondSide_email;
					var to = 'invitation@agree-online.com';
					var smtpTransport = nodemailer.createTransport("SMTP",{
						service: "Gmail",
						auth: {
							user: "invitation@agree-online.com",
							pass: "agree4321"
						}
					});
					//

					var mailOptions = {
						from: from,
						to: to,
						//subject:'לפתרון המחלוקת איתך  ' + disputeUserName + 'הזמנה מ',
						subject:'סכסוך חדש',
						html: mailHTML
					}
					//
					smtpTransport.sendMail(mailOptions, function(error, response){
						if(error){
							//console.log(error);
						}else{
							// res.redirect('/');
						}
					});
				})
			}
		])
	}

	function mediatorRegister(res,req,id){
		var email = req.query.email;
		var name1 = req.query.name;

		//var transporter = nodemailer.createTransport();
		//transporter.sendMail({
		//	from: 'notrespond@besmarter.co.il',
		//	to: 'mor@zloof.co.il',
		//	subject: 'בקשה להיות מגשר מagree',
		//	html: 'המשתמק ' + name +' שלח בקשה להיות מגשר במערכת<br>'
		//		+ 'המייל של הלקוח:<br>'
		//		+ email + '<br>'
		//});

		var mailHTML = 'השם של המשתמש:<br>'
			+ name1 + '<br>'
			+ 'המייל של הלקוח:<br>'
			+ email + '<br>'

		var name = decodeURIComponent(name1);
		var userName = decodeURIComponent(name1);
		var from = 'invitation@agree-online.com';
		//var to = secondSide_email;
		var to = 'invitation@agree-online.com';
		var smtpTransport = nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "invitation@agree-online.com",
				pass: "agree4321"
			}
		});
		//

		var mailOptions = {
			from: from,
			to: to,
			//subject:'לפתרון המחלוקת איתך  ' + disputeUserName + 'הזמנה מ',
			subject:'משתמש חדש מעוניין להיות מנחה',
			html: mailHTML
		}
		//
		smtpTransport.sendMail(mailOptions, function(error, response){
			if(error){
				//console.log(error);
			}else{
				// res.redirect('/');
			}
		});

		res.send("success");
	}
	this.mediatorRegister = mediatorRegister;
	//get: pass
	function checkDisputePass(res,req,id){
		var pass = req.query.pass;
		
		var sql = 'SELECT count(*) AS checkDispute '
				+ 'FROM disputeStart '
				+ 'WHERE pass=' + pass + '; '
				
				+ 'SELECT * '
				+ 'FROM disputeStart '
				+ 'WHERE pass=' + pass + '; '
				
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
	//get: name, email, password, parties2_text ,disputeName, pass
	// error: you all ready register
	// error: not dispute
	function registerSecondSide(res,req,id){
		var name1 = req.query.name;
		var email = req.query.email;
		var password = req.query.password;
		var parties2_text = req.query.parties2_text;
		var disputeUserName = req.query.disputeUserName;
		var pass = req.query.pass;
		console.log(name1)
		async.waterfall([
			function(callback){
				var sql = 'SELECT count(*) AS counter FROM users WHERE email = "' + email + '"';
				
				pool.query(sql,function(err,result){
					if(result[0].counter==1){
						res.send("error: you all ready register");
					}
					else{
						callback(null);
					}
				})
			},function(callback){
				var sql = 'SELECT count(*) AS counter '
						+ 'FROM disputeStart '
						+ 'WHERE pass=' + pass + ';';
				
				pool.query(sql,function(err,result){
					if(result[0]['counter']==0){
						res.send("error: not dispute")
					}
					else{
						callback(null)
					}
				})
				
			},function(callback){
				var sql = 'INSERT INTO users '
							+ '(email,firstName,mentor,date) '
						+ 'VALUES '
							+ '("' + email + '","' + name1 +'","' + password + '",NOW()); '

						+ 'INSERT INTO usersPassword '
							+ '(id,email,password) '
						+ 'VALUES '
							+ '((SELECT id FROM users WHERE email="' + email + '"),"' + email +'","' + password + '"); '

						+ 'UPDATE disputeStart SET '
							+ 'parties2_name="' + disputeUserName + '", '
							+ 'parties2_text="' + parties2_text + '", '
							+ 'parties2_id=(SELECT id FROM users WHERE email="' + email + '") '
						+ 'WHERE pass= ' + pass + ';'

				pool.query(sql,function(err,result){
					callback(null)
					login(res,req);
				})
			},function(callback){
				var sql = 'SELECT * '
						+ 'FROM disputeStart '
						+ 'WHERE pass="' + pass + '";'
			
				pool.query(sql,function(err,result){
					var json = result[0];
					var title = json.title;
					var parties1_name = json.parties1_name;
					var parties2_name = json.parties2_name;
					var parties1_text = json.parties1_text;
					var parties2_text = json.parties2_text;
					var parties1_id = json.parties1_id;
					var parties2_id = json.parties2_id;

					var sql = 'INSERT INTO dispute '
							+ '(title,parties1_id,parties1_name,parties1_FirstTextProblem,parties2_id,parties2_name,parties2_FirstTextProblem,mediator_id,mediator_name,startDate) '
								+ 'VALUE'
							+ '("' + title + '",' + parties1_id + ',"' + parties1_name + '","' + parties1_text + '",' + parties2_id +',"' + parties2_name + '","' + parties2_text + '",3,"Agree Online",NOW()); '

							+ 'INSERT INTO notification '
							+ '(users_id,other,other_name,other_name1,text_type,image_type,date) '
								+ 'VALUES '
							+ '(3,(SELECT max(id) FROM dispute),"' + parties1_name + '","' + parties2_name + '",1,3,NOW()); '

							+ 'DELETE FROM disputeStart '
							+ 'WHERE pass= ' + pass + ' LIMIT 1;'

					pool.query(sql);
				})
			}
		])
	}
	
	//get: name, email, password, secondSide_name, secondSide_email, disputeTitle, parties1_text ,disputeUserName
	// error: you all ready register
	function registerFirstSide(res,req,id){
		var name1 = req.query.name;
		var email = req.query.email;
		var password = req.query.password;

		var secondSide_name = req.query.secondSide_name;
		var secondSide_email = req.query.secondSide_email;

		var disputeTitle = req.query.disputeTitle;
		var parties1_text = req.query.parties1_text;
		var disputeUserName = req.query.disputeUserName;
		var pass = Math.floor((Math.random() * 10000) + 1);;

		async.waterfall([
			function(callback){

				var sql = 'SELECT count(*) AS counter FROM users WHERE email = "' + email + '"';

				pool.query(sql,function(err,result){
					if(result[0].counter==1){
						res.send("error: you all ready register");
					}
					else{
						callback(null);
					}
				})
			},function(callback){
				console.log(name1)
				var sql = 'INSERT INTO users '
							+ '(email,firstName,mentor,date) '
						+ 'VALUES '
							+ '("' + email + '","' + name1 +'","' + password + '",NOW()); '

						+ 'INSERT INTO usersPassword '
							+ '(id,email,password) '
						+ 'VALUES '
							+ '((SELECT id FROM users WHERE email="' + email + '"),"' + email +'","' + password + '"); '

						+ 'INSERT INTO disputeStart '
						+ '(parties1_id,parties1_name,parties1_text,title,parties2_name,pass,date)'
							+ 'VALUES '
						+ '((SELECT id FROM users WHERE email="' + email + '"),"' + disputeUserName + '","' + parties1_text + '","' + disputeTitle + '","' + secondSide_name + 	'",' + pass + ',NOW())'

						var url = 'http://' + req.get('Host') + '/#register?pass=' + pass

						secondSide_name = decodeURIComponent(secondSide_name);
						disputeTitle = decodeURIComponent(disputeTitle);
						disputeUserName = decodeURIComponent(disputeUserName);

						//var mailHTML = '<div style="text-align:right;float:right;width:100%;">'
						//			+ secondSide_name + ' שלום<br>'
						//			+ ' .ניתן לפתור באמצעותנו את המחלוקת איתך ' + secondSide_name + ' מכיוון שלדעת ,Agree Online, המייל הזה נשלח אליך מאיתנו<br>'
						//			+ '."' + disputeTitle + '" המחלוקת היא בנושא ,' + name + ' לדברי <br>'
						//			+ '.היא רשת חברתית המסייעת ליישב מחלוקות בהסכמה, בדרך מהירה וידידותית Agree Online <br>'
						//			+ '.להחליט על הדרך הנכונה לפתרון המחלוקת, בהובלת מנחה ניטרלי ובסיוע של יועצים מקהל המשתמשים ' + secondSide_name + ' תאפשר לך ול Agree Online <br><br>'
						//			+ '?למה לך ליישב את המחלוקת באמצעותנו'
						//				+ '<ul style="direction:rtl">'
						//					+ '<li>כי זה חינם!</li>'
						//					+ '<li>כי המערכת היא דיסקרטית ומאפשרת לך חשיפה מצומצמת.</li>'
						//					+ '<li>כי אנחנו נפעיל עבורך מאגר רחב של אנשים יצירתיים במטרה למצוא פתרון מהיר ויעיל למחלוקת, שיהיה טוב לשני הצדדים.</li>'
						//					+ '<li>כי המערכת היא פשוטה, שקופה ולגמרי ניטרלית.</li>'
						//					+ '<li>כי כל ההליך אצלנו כפוף לחלוטין להסכמה שלך ולא יקרה בו דבר בלי הסכמתך.</li>'
						//				+ '</ul>'
						//				+ '.ובעיקר, כי אנחנו נהיה שם לאורך כל הדרך ונסייע עד שתגיעו לפתרון מוסכם של המחלוקת<br>'
						//				+ '.כדי להתחיל עכשיו לפתור את המחלוקת יש ללחוץ <a href="' + url + '">כאן</a><br>'
						//				+ '.להתרשמות מהמערכת, ניתן ללחוץ <a href="http://84.95.248.51">כאן</a><br>'
						//				+ '.ניתן להתחיל את התהליך לסיום המחלוקת גם באמצעות הזנת המספר ' + pass + ' בטופס ההרשמה<br><br>'
						//				+ '<div style="direction:rtl">אם יש לך שאלות, ניתן לפנות אלינו במייל: admin@agree-online.com </div>'
						//				+ '<div style="direction:rtl">צוות Agree Online</div>'
						//			+ '</div>'

						var mailHTML = '<div style="text-align:right;float:right;width:100%;direction:rtl">'
									+ 'פתיחת סכסוך חדש<br>'
									+'המייל של  הצד המזמין:' + email + '<br>'
									+'השם של הצד המזמין:'  + decodeURIComponent(name1) +'<br>'
									+'המייל של הצד המוזמן:'  + secondSide_email +'<br>'
									+'השם של הצד המוזמן:'  + decodeURIComponent(secondSide_name) +'<br>'
									+'נושא המחלוקת:'  + decodeURIComponent(disputeTitle) +'<br>'
									+'סיפור המחלוקת:'  + decodeURIComponent(parties1_text) +'<br>'
									+'הכינוי של הצד המזמין:'  + decodeURIComponent(disputeUserName) +'<br>'
									+'   סיסמה:'  + pass +'<br>'
									+ '</div>'


						 var url = 'http://' + req.get('Host') + '/#register?pass=' + pass
						 var name = name1;
						 var userName = name;
						 var from = 'invitation@agree-online.com';
						//var to = secondSide_email;
						 var to = 'invitation@agree-online.com';
						 var smtpTransport = nodemailer.createTransport("SMTP",{
						 	service: "Gmail",
						 	auth: {
						 		user: "invitation@agree-online.com",
						 		pass: "agree4321"
						 	}
						 });
                         //

						 var mailOptions = {
						 	from: from,
						 	to: to,
						 	//subject:'לפתרון המחלוקת איתך  ' + disputeUserName + 'הזמנה מ',
							subject:'סכסוך חדש נפתח',
						 	html: mailHTML
						 }
                         //
						 smtpTransport.sendMail(mailOptions, function(error, response){
						 	if(error){
						 		//console.log(error);
						 	}else{
						 		// res.redirect('/');
						 	}
						 });

				pool.query(sql,function(err,result){
					login(res,req);
				})
			}
		])
	}
	
	//get: name, email, password
	// error: you all ready register
	function register(res,req,id){
		var name = req.query.name;
		var email = req.query.email;
		var password = req.query.password;
	
		async.waterfall([
			function(callback){
				var sql = 'SELECT count(*) AS counter FROM users WHERE email = "' + email + '"';
				
				pool.query(sql,function(err,result){
					if(result[0].counter==1){
						res.send("error: you all ready register");
					}
					else{
						callback(null);	
					}
				})
			},function(callback){
				var sql = 'INSERT INTO users '
							+ '(email,firstName,mentor,date) '
						+ 'VALUES '
							+ '("' + email + '","' + name +'","' + password + '",now()); '
		
						+ 'INSERT INTO usersPassword '
							+ '(id,email,password) '
						+ 'VALUES '
							+ '((SELECT id FROM users WHERE email="' + email + '"),"' + email +'","' + password + '"); '
		
				pool.query(sql,function(err,result){
					login(res,req);
				})
			}
		])
	}
	
	function getMyUser(res,req,id){
		var sql = 'SELECT * FROM users WHERE id=' + id + ';';

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	//get: email password
	function login(res,req){
		async.waterfall([
			function(callback){
				var email = req.query.email;
				var password = req.query.password;
		
				var sql = 'SELECT * '
                        + 'FROM usersPassword '
                        + 'WHERE email="' + email + '" AND password="' + password + '"; ';

				pool.query(sql,function(err,result){
                    var resultLength = result.length;

                    if(resultLength>0){
                        var userId = result[0].id;
                    
                        var sql = 'SELECT * '
                                + 'FROM users '
                                + 'WHERE id=' + userId + '; '
                        pool.query(sql,function(err,result){
                            var userBlock = result[0].block;
console.log(userBlock);
                            if(userBlock==0){
                                var id = result[0].id;
                                callback(null,id);
                            }
                            else{
                                res.send("error: password or email not currect");
                            }
                        })
                    }
                    else{
                        res.send("error: password or email not currect");
                    }
				}) 
			},function(id,callback){
				var session = createSession();
				var sql = 'DELETE FROM usersSession WHERE id=' + id + ';' + 
				'INSERT INTO usersSession (id,session) VALUES (' + id + ',"' + session + '")';
		
				res.send(session);
				pool.query(sql);
			}
		])
	}
	this.login = login;
	
	function createSession(){
		function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
	  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}
