var notifications = new notifications();
function notifications() {
	function ctor() {
        getNotifications();
        setInterval(function(){
            if($.globalUser!=undefined){
                getNotifications();
            }
        },5000)
	}
	this.ctor = ctor;

	function showPage() {
		$('.header_link').removeClass('active')
		$(".header_messages").addClass('active')

		global.globalHide();
		$(".global_page_notifications").show();
		setInterval(function(){
			getNotifications();
		}, 10000)

	}
	this.showPage = showPage;

	var firstData = '';
	function getNotifications() {
		var data = {};
    	var url = '/api/notification/showNotifications/';

		global.api(url, data, function(data) {
			data = JSON.parse(data);
            var points = data[0][0].points
            data = data[1]
            
            $.globalUser.points = points;
            
			$(".header_messages_count").text(data.length);

			if(firstData != JSON.stringify(data)) {
				firstData = JSON.stringify(data);
				var currentNotification = '';
				$('.notifications_container').html('');
				if(data.length == 0) {
					$('.notifications_no_messages').show();
				}
				else {
					$('.notifications_no_messages').hide();

					for(var i = 0; i < data.length; i++) {
						currentNotification = notificationCreator(data[i]);
						$('.notifications_container').append(currentNotification);
					}
					$('.notifications_notification').click(bindNotificationsClick);
				}
                getLanguage(function(){
                    for(var i = 0; i < data.length; i++) {
                        var div = $('.notifications_notification:eq(' + i + ')').find(".notifications_notification_subtitle span");
                        var text = div.text();
                        var newText = text.replace("$1234", decodeURIComponent(data[i].other_name));
                        newText = newText.replace("xxX", $.globalUser.points);
                        newText = newText.replace("$1235", decodeURIComponent(data[i].other_name1));

                        div.text(newText);
                    }
                });

			}
		});
	}

	function notificationCreator(notification) {
		/* --- Currently no notification title in DB -- */
		var notificationId = 'notifications_notification' + notification.id;
		var notificatioType = 'type' + notification.text_type;
		var notificatioTypeNum = notification.text_type;
		var notificationOther = notification.other;
		var notificationText = notificationTextParser(notification.text_type, notificationOther,notification.title);
        
        if(notification.text_type==200){
		  var notificatioImageType = 'imageType3';
        }
        else if(notification.text_type==201){
            var notificatioImageType = 'imageType4';
        }
        else if(notification.text_type==202){
            var notificatioImageType = 'imageType5';
        }
        else{
		  var notificatioImageType = 'imageType' + notification.image_type;
        }
        
        var notificationTitle = notification.title
		var notificationTime = notificationTimeParser(notification.date);
        var points = notification.points;
        var notificaionJson = notification;
		var notification = $('#notifications_notification_master');
		var notificationClone = notification.clone();

		notificationClone.prop('id', notificationId);
		notificationClone.attr('data-other', notificationOther);
		notificationClone.addClass(notificatioImageType);
		notificationClone.addClass(notificatioType);
		notificationClone.find('.notifications_notification_subtitle').html(notificationText);
		notificationClone.find('.notifications_notification_time').html(notificationTime);

        notificationClone.find(".notifications_notification_points_num").text(points)
        
		//var checkOther =  notificationClone.find('notifications_notification_subtitle').text()
        
        notificationClone.find(".notifications_notification_title").text(decodeURIComponent(notificationTitle))
        
        if(notificatioTypeNum==1){
            var name = decodeURIComponent(notificaionJson.other_name);
            var name1 = decodeURIComponent(notificaionJson.other_name1);
            var text = 'הצדדים ' + name + ' ו' + name1 + '';
            notificationClone.find(".notifications_notification_title").text(decodeURIComponent(text))
        }
        if(notificatioTypeNum>99){
            notificationClone.find(".notifications_notification_points").show()
            notificationClone.find(".notifications_notification_title").css('opacity','1')
            notificationClone.find(".notifications_notification_title").text(decodeURIComponent(notificationTitle))
            notificationClone.find(".notifications_notification_subtitle").addClass('notifications_notification_subtitleAddClass');
        }
        
        if(notificatioTypeNum>199){
            notificationClone.find(".notifications_notification_title").text('ברכות קיבלת קידום!')
            notificationClone.find(".notifications_notification_points").hide()
        }
        
		return notificationClone;
	}

	function notificationTextParser(textType, other,title) { // handle text shown on notification
    
		var text = '';
        //if(textType>199){
       //     text = '<span>ברכות קיבלת קידום!</span>';            
       // }
       // else{
		  text = '<span class="notifications_textType_' + textType + '"></span>';
        //}
		//if(textType == 1) {
		//	text = '<span class="notifications_textType_1"></span>';
		//}
		//else if (textType == 2) {
		//	text = '<span class="notifications_offered_solution"></span>' + other + ' <span class="notifications_offered_solution_part2"></span>'
		//		 + '<span class="notifications_points_won">' + other + '</span>'
		//		 + '<span class="notifications_points_won_label"></span>';
		//}
		//else if (textType == 3) {
		//	text = '<span class="notifications_won_a_wig"></span>';
		//}
		return text;
	}

	function notificationTimeParser(time) {
		var now = new Date();
		var time = new Date(time);
		var hours = Math.abs(now - time) / 36e5;
		var HTML = '<span class="notifications_published"></span> ';
		var HTMLtime = '';
		if(hours < 0.2) {
			HTMLtime = '<span class="notifications_now"></span>';
		}
		else if(hours < 0.5) {
			HTMLtime = '<span class="notifications_half_hour"></span>';
		}
		else if(hours < 1) {
			HTMLtime = '<span class="notifications_hour"></span>';
		}
		else if(hours < 2) {
			HTMLtime = '<span class="notifications_2_hours"></span>';
		}
		else if(hours < 3) {
			HTMLtime = '<span class="notifications_3_hours"></span>';
		}
		else if(hours < 4) {
			HTMLtime = '<span class="notifications_4_hours"></span>';
		}
		else if(hours < 24) {
			HTMLtime = '<span class="notifications_24_hours"></span>';
		}
		else if(hours < 168) {
			HTMLtime = '<span class="notifications_this_week"></span>';
		}
		else if(hours < 336) {
			HTMLtime = '<span class="notifications_2_weeks"></span>';
		}
		else if(hours < 720) {
			HTMLtime = '<span class="notifications_this_month"></span>';
		}
		else {
			HTMLtime = '<span class="notifications_more_than_month"></span>';
		}

		return (HTML + HTMLtime);
	}

	function bindNotificationsClick(e) { // handle notificaiton click settings
		var notification = $(this)
		var notificationId = notification.attr('id');
		var id = notificationId.substring(26);
		var other = notification.attr('data-other');

		var data = {notification_id: id};
        var url = '/api/notification/readNotifications/';

		global.api(url, data, function(data) {
		});

		if(notification.hasClass('type1') || notification.hasClass('type2')) {
			location.href = ('#initDispute?dispute_id=' + other);
		}
		else{
			location.href = ('#dispute?dispute_id=' + other);
		}
	}

	function getLanguage(callback) {
		global.getLanguage('notifications', function(xml) {
			xml = $(xml);
			echoLanguage(xml);
			callback()
		})
	}

	function echoLanguage(xml) {

		var currentItem = '';
		var currentItemName = '';

        $('leaf', xml).each(function(){
        	currentItem = $(this);
        	currentItemName = currentItem.attr('name');
        	currentItemContent = currentItem[0].innerHTML;
			var text= xml.find('leaf[name="' + currentItemName + '"]').text()
            
            $("." + currentItemName).html(text);
        })
	}

}