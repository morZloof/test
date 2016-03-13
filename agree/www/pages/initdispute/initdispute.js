var initDispute = new initDispute();
function initDispute() {
	$.dispute_details;
	function ctor() {
		$('#initdispute_form').submit(getSendFormData);
		$('.initdispute_input').change(bindErrorRemove);
		getLanguage();
	}
	this.ctor = ctor;

	function showPage() {
		global.globalHide();
		getDispute(getDisputeId);
		$(".global_page_init_dispute").show();
	}
	this.showPage = showPage;

	function getDisputeId() {
	    var query = String(window.location);
	    var disputeId = query.substring((query.indexOf('=') + 1));
	    return disputeId;
	}
	
	function getDispute(disputeId) {
		var data = {dispute_id: disputeId()};
		var url = '/api/dispute/getDispute/';

		global.api(url, data, function(data) {
			var data = JSON.parse(data);
			$.dispute_details = data[0];

            $.initDispute_name1 = data[5][0].firstName;
            $.initDispute_name2 = data[6][0].firstName;
            
			setPermissions();
			showInitDispute();
		});
	}

	function setPermissions() {
		if($.globalUser.id == $.dispute_details[0].mediator_id) {
			$.isMediator = true;
		}
		else { // user is side in dispute
			if($.globalUser.id == $.dispute_details[0].parties2_id) {
				$.side = 2;
			}
            else{
                $.side = 1;
            }
		}

		if(!$.isMediator) {
			$('.initdispute_mediator').hide();
			if($.side == 1) {
				$('.side2 .initdispute_story_content').addClass('fade');
			}
			else { // side = 2
				$('.side1 .initdispute_story_content').addClass('fade');
			}
		}
		else {
			$('.initdispute_side').hide();
		}
	}
	$.isMediator;
	$.side;

	function showInitDispute() {
        $(".initdispute_story_nickname").find('.initdispute_nickname_side1').html(decodeURIComponent($.dispute_details[0].parties1_name));
        $(".initdispute_story_nickname").find('.initdispute_nickname_side2').html(decodeURIComponent($.dispute_details[0].parties2_name));
        $(".initdispute_story_nickname_bottom").find('.initdispute_nickname_side1').html(decodeURIComponent($.dispute_details[0].parties1_name));
		$(".initdispute_story_nickname_bottom").find('.initdispute_nickname_side2').html(decodeURIComponent($.dispute_details[0].parties2_name));
		$(".initdispute_side1_color").find('.initdispute_nickname_side1').html(decodeURIComponent($.dispute_details[0].parties1_name));
		$(".initdispute_side2_color").find('.initdispute_nickname_side2').html(decodeURIComponent($.dispute_details[0].parties2_name));
        
        $('.initdispute_title_side').html(decodeURIComponent($.dispute_details[0].title));
		$('.side1 .initdispute_story_content').html(decodeURIComponent($.dispute_details[0].parties1_FirstTextProblem));
		$('.side2 .initdispute_story_content').html(decodeURIComponent($.dispute_details[0].parties2_FirstTextProblem));
		
        
        if($.side == 1) {
			$('.initdispute_nickname_not_you').html(decodeURIComponent($.initDispute_name2));
		}
		else {
			$('.initdispute_nickname_not_you').html(decodeURIComponent($.initDispute_name1));
		}
        
        $(".initdispute_story_title").find('.initdispute_nickname_side1').html(decodeURIComponent($.initDispute_name1));
		$(".initdispute_story_title").find('.initdispute_nickname_side2').html(decodeURIComponent($.initDispute_name2));
	}

	function getSendFormData(e) {
		e.preventDefault();
		var isAllValid = true;

		if($.isMediator) {
			$('#' + this.id + ' .initdispute_input').each(function() {
				isValid = validateField($(this));
				if(!isValid) {
					isAllValid = false;
				}
			});

			if(!isAllValid) {
				return;
			}
		}

		if(isAllValid || $.isMediator == false) {
			var disputeId = getDisputeId();
			var data = '';
			var url = '';

			if($.isMediator) {
				var title = encodeURIComponent($('.initdispute_input_title').val());
		    	data = {dispute_id: disputeId, title: title};
		    	url = '/api/dispute/setTitle/';
		    	global.api(url, data, function(data) {});
			}
	    	// data = {dispute_id: disputeId};
	    	// url = '/api/dispute/firstAgree/';

			// global.api(url, data, function(data) {
				//if($.dispute_details[0].parties1_id==$.globalUser.id || $.dispute_details[0].parties2_id==$.globalUser.id){
					window.location.href = '/#dispute?disputeId=' + $.dispute_details[0].id;
				//}
				//else{
				//	window.location.href = '/#allDisputes';
				//}
			// });
		}
	}

	function bindErrorRemove() {
		$(this).removeClass('error');
		if($(this).attr('type') == 'text') {
			$('.initdispute_input_label_error').hide();
		}
	}

	function validateField(currentField) {
		var isValid = true;
		var currentFieldType = currentField.attr('type');
		var currentFieldValue = currentField.val();		

		if(currentFieldValue == '') {
			isValid = false;
			$('.initdispute_input_label_error').show();
		}
		else if(currentFieldType == 'checkbox') {
			if(!(currentField).is(":checked")) {
				isValid = false;
			}
		}

		if(!isValid) {
			currentField.addClass('error');
		}

		return isValid;
	}

	function getLanguage() {
		global.getLanguage('initdispute', function(xml) {
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
	}

}