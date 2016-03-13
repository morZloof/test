var header = new headerJS()
function headerJS (){
	function ctor(){
		$(".header_logout").click(logout);
		$(".header_greeting_name_logOut_goToLogin").click(goToLogin);
		$(".header_messages").click(goToNotifications);
		$('#dispute_header_feel, .header_fade').click(toggleProfile);
        
		getProfile();
		getLanguage();
	}
	this.ctor = ctor;

	function logout(){
		global.logOut()
		location.href = "/";
	}

	function goToNotifications(){
		location.href = '#notifications';
	}
	function headerEchoUserName(json){
		$(".header_greeting_name_logOut").hide()
		$(".header_greeting_name_logIn").show()
		$(".header_greeting_name_logIn_userName").text(decodeURIComponent(json.firstName))
	}
	this.headerEchoUserName = headerEchoUserName;
	
	function goToLogin(){
		login.showPage()
	}

	function toggleProfile() {
		$('.header_profile_container').toggle();
		$('.header_fade').toggle();
        
        getProfile();
	}
    this.toggleProfile = toggleProfile;
    
	function getProfile() {
		var url = '/api/users/getProfile/';
		var data =  {};
		global.api(url, data, function(data) {
			data = JSON.parse(data);
			console.log(data);

			$('.header_profile_last_name').html(data[0][0].lastName);
			$('.header_profile_first_name').html(decodeURIComponent(data[0][0].firstName));
			$('.header_profile_email').html(data[0][0].email);

			$('.header_profile_points_data').html(data[0][0].points);
            
            var imgLevel = parseLevelToImg(data[0][0].points);
            if(imgLevel!=null && imgLevel!=''){
			     var currentPointsImg = '<img src="www/images/header/' + imgLevel + '.png">'
            }
			
            $('.header_profile_level').html(currentPointsImg);
            var nextImgLevel = parseNextLevelToImg(data[0][0].points);
			var nextPointsImg = '<img src="www/images/header/' + nextImgLevel + '.png">'
			$('.header_profile_next_level').html(nextPointsImg + '<span class="header_profile_next_level_label">ההישג הבא</span>');
            
            if(nextImgLevel==null || nextImgLevel==''){
                $(".header_profile_next_level").hide()
            }
            else{
                $(".header_profile_next_level").show()
            }
			
            var activeDisputes = data[1];
            
            $(".header_profile_active_disputes_dispute").remove()
			for(var i = 0; i < activeDisputes.length; i++) {
				$('.header_profile_active_disputes').append(activeDisputeCreator(activeDisputes[i]));
			}
			
            bindHoverActiveDisputes();
            
            echoText(data[0][0].points);
            
            checkIfFinishLevel(data[0][0].points,data[0][0].level);
		});
	}
    
    function checkIfFinishLevel(points,level){

        setTimeout(function(){
            if((points>10 && points<51) && level==0){
                allDisputes.openPopUp(1);
                updateLevel()
            }
            else if((points>50 && points<101) && level==1){
                allDisputes.openPopUp(2);
                updateLevel()
            }
            else if(points>100 && level==2){
                allDisputes.openPopUp(3);
                updateLevel()
            }
        },1000)
    }
    
    function updateLevel(){
        $('.header_profile_container').hide();
		$('.header_fade').hide();
        
        var url = '/api/users/updateLevel/';
		var data =  {};
		global.api(url, data, function(data) {
        })
    }
    
    function echoText(points){
        if(points<10){
            var theText = $.headerXml.find('leaf[name="header_profile_next_level_level0"]').text()
            theText = theText.replace('1234',10-points)
            $(".header_profile_achivments_data").text(theText);
        }
        else if(points<51){
            var theText = $.headerXml.find('leaf[name="header_profile_next_level_level1"]').text()
            theText = theText.replace('1234',50-points)
            $(".header_profile_achivments_data").text(theText);
        }
        else if(points<101){
            var theText = $.headerXml.find('leaf[name="header_profile_next_level_level2"]').text()
            theText = theText.replace('1234',100-points)
            $(".header_profile_achivments_data").text(theText);
        }
        else{
            var theText = $.headerXml.find('leaf[name="header_profile_next_level_level3"]').text()
            $(".header_profile_achivments_data").text(theText);
        }
        //alert()
    }
    
	function activeDisputeCreator(activeDispute) {
		var HTML = '';
		HTML += '<div class="header_profile_active_disputes_dispute">'
			  +		'<a href="#dispute?dispute_id=' + activeDispute.id + '">' + decodeURIComponent(activeDispute.title) + '</a>'
			  +		'<a class="header_profile_active_disputes_dispute_to_enter" href="#dispute?dispute_id=' + activeDispute.id + '">'
			  +			'<span class="header_profile_active_disputes_dispute_to_enter_label">לכניסה</span> <span class="glyphicon glyphicon-arrow-left"></span>'
			  +		'</a>'
			  + '</div>'
		return HTML;
	}

	function bindHoverActiveDisputes() {
		$('.header_profile_active_disputes_dispute').mouseenter(function() {
			$(this).find('.header_profile_active_disputes_dispute_to_enter').show();
		});
		$('.header_profile_active_disputes_dispute').mouseleave(function() {
			$(this).find('.header_profile_active_disputes_dispute_to_enter').hide();
		});
		$('.header_profile_active_disputes_dispute a').click(function() {
			$('.header_fade').hide();
			$('.header_profile_container').hide();
		})
	}

	function parseLevelToImg(points) {
		// -- Need to edit this so all level will be parsed correctly --
		var img = '';
		if(points > 99) {
			img = 'level3';
		}
		else if(points > 49) {
			img = 'level2';
		}
		else if(points>9){
			img = 'level1';
		}
        else{
            null;
        }

		return img;
	}

    function parseNextLevelToImg(points){
        var level = parseLevelToImg(points);
        
        var img;
        if(level=='level1'){
            img = 'level2';    
        }
        else if (level=='level2'){
            img = 'level3';
        }
        else if(level=='level3'){
            img = null;
        }
        else{
            img=null;
        }

		return img;
    }
	function getLanguage() {
		global.getLanguage('header', function(xml) {
			xml = $(xml);
			echoLanguage(xml);
		});
	}

	function echoLanguage(xml) {
		var currentItem = '';
		var currentItemName = '';

        $('leaf', xml).each(function(){
        	currentItem = $(this);
        	currentItemName = currentItem.attr('name');
        	currentItemContent = currentItem[0].innerHTML;
            $("." + currentItemName).text(xml.find('leaf[name="' + currentItemName + '"]').text());
        })
        $.headerXml = xml;
	}

}