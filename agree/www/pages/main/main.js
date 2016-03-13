var vmain = new mainJs()
function mainJs(){
	function ctor() {
		$('.main_header_section').click(fadeActiveHeaderSection);
		$('.main_btn_body').click(showPopUp);
		$('.main_stage').click(goToStage);
		$('#main_body_section_manage_send_btn').unbind('click');
		$('#main_body_section_manage_send_btn').click(getSendManageForm);
		$('#main_popup_invite_other_side_btn_stage1').click(goToNextStage);
		$('#main_popup_agree_to_settle_btn_stage1').click(goToNextStage);
		$('#main_popup_auto_invited_btn_stage1').click(goToNextStage);
		$('#main_popup_offer_solution_btn_stage4').click(goToNextStage);
		$('.main_popup_form_input').keypress(removeError);
		$('.main_body_section_manage_form_input').keypress(removeError);
		$(".main_popup_form_link").click(goToLogin)
		// $('.main_body_section_manage_send').click(sendMail);
        
        $(".main_body_section_close").click(closeRegister)
		getLanguage();
		
		checkIfInvited();	
	}
	this.ctor = ctor;

	function showPage() {
		setTimeout(function(){
			location.href= "#main";
		},1000)
		$('.header_link').removeClass('active')
		$(".header_dispute_main").addClass('active')
		global.globalHide();
		$(".global_page_main").show();

		allDisputes.showPageWithLoginPage()
	}
	this.showPage = showPage;
	$.validateRegistration = true;
    
    function closeRegister() {
        $('.main_body').hide();
		$('.main_header_section').removeClass('fade');
		$(".main_header_section").removeClass('fade');
		$(".main_header_section").removeClass('active');
		$('.main_body_section').hide();
		$('#main_body_section').hide();
    }
	function goToLogin(){
		hidePopUp()
		login.showPage()
	}
	function sendMail(){
		$(".main_body_section_manage_send").hide()
		$(".main_body_section_manage_send_successMessage").show()
	}

	function fadeActiveHeaderSection() {
		$('.main_body').show();
		$('.main_header_section').addClass('fade');
		$('.main_header_section').removeClass('active');
		$(this).removeClass('fade');
		$(this).addClass('active');
		var sectionId = $(this).attr('id').substring(20);
		$('.main_body_section').hide();
		$('#main_body_section_' + sectionId).show();
	}

	function showPopUp(popUpToShowId) {
		var popUpToShow = $(this).attr('data-popup');

		if(popUpToShow == 'main_popup_agree_to_settle_stage1') {
			$('.main_popup_agree_to_settle_btn_stage1_fix').css('height', '660px');
		}

		if(!popUpToShow) {
			popUpToShow = popUpToShowId // used for auto popup with invite id
		}

		$('.main_header').addClass('main_blur');
		$('.main_body').addClass('main_blur');
        $('.all_disputes').addClass('main_blur');
        
		$('.main_popup_wrapper').show();
		$('.main_popup').hide();
		$('#' + popUpToShow).parent().show();
		$('#' + popUpToShow).show();

		if(popUpToShow == 'main_popup_invite_other_side_stage1') {
			if($.globalUser) {
				$('.main_stage').removeClass('current');
				$('#main_popup_invite_other_side_status_stage1').addClass('done');
				$('#main_popup_invite_other_side_status_stage2').addClass('current');
				$('#main_popup_invite_other_side_stage1').hide();
				$('#main_popup_invite_other_side_stage2').show();
				$('#main_popup_invite_other_side_btn_stage2').click(goToNextStage);
				$.validateRegistration = false;
			}
		}

		$('.main_popup_wrapper').click(hidePopUp);
		$('.main_popup').click(function(e) { // remove parent event from popup
			e.stopPropagation();
		});
	}

	function hidePopUp(e) {
		var visibleStages = $('.main_stage:visible').parent().attr('id');
		$('.main_header').removeClass('main_blur');
		$('.main_body').removeClass('main_blur');
        $('.all_disputes').removeClass('main_blur');
        
		$('.main_stage_content').hide();
		$('.main_popup_wrapper').hide();
		$('#' + visibleStages + ' .main_stage').removeClass('done');
		$('#' + visibleStages + ' .main_stage').removeClass('current');
		$('#' + visibleStages + ' .main_stage').first().addClass('current');
	}

	function goToStage() {
		var thisStageStatusId = $(this).attr('id');
		var thisStageNumber = thisStageStatusId.substring(thisStageStatusId.length - 1);
		var thisStageParent = $(this).parent().attr('id');
		var thisStageIdInit = thisStageParent.substring(0, thisStageParent.length - 1);
		var stageToGoId = thisStageIdInit + thisStageNumber;

		var visibleStages = $('.main_stage:visible').parent().attr('id');
		$('#' + visibleStages + ' .main_stage').removeClass('current');
		$('#' + stageToGoId).addClass('current');

		var thisStageContentInit = thisStageParent.substring(0, thisStageParent.length - 14);
		var thisStageContentId = thisStageContentInit + '_stage' + thisStageNumber;
		$('.main_stage_content').hide();
		$('#' + thisStageContentId).show();
	}

	function goToNextStage(e) {
		e.preventDefault();
		var isValid = true;
		var isAllValid = true;

		var thisStageFormId = $(this).parent().attr('id');
		$('#' + thisStageFormId + ' .main_popup_form_input').each(function() {
			isValid = validateField($(this));
			if(!isValid) {
				isAllValid = false;
			}
		});

		if(!isAllValid) {
			return;
		}

		//if($(this).attr('id') == 'main_popup_agree_to_settle_btn_stage1') {
			$('#main_popup_agree_to_settle_status_stages').show();
			$('.main_popup_agree_to_settle_btn_stage1_fix').css('height', '790px');

	    	var data = {};
	    	data.pass = $('#main_popup_agree_to_settle_pass').val();
	    	var url = '/api/users/checkDisputePass/';

			global.api(url, data, function(data) {
				data = JSON.parse(data);
				var checkDispute = data[0][0].checkDispute;

				if(!checkDispute) {
					hidePopUp();
					showPopUp('main_popup_agree_to_settle_stage1');
					$('.main_popup_agree_to_settle_btn_stage1_fix').css('height', '660px');
				}
			});
		//}


		if($(this).attr('id') == 'main_body_section_offer_solution_btn_stage4') {
			return;
		}

		var thisStageNumber = $(this).attr('data-stage');
		var nextStageNumber = ++thisStageNumber;

		if(nextStageNumber == 5) {
			getSendFormData($(this).parent().parent().attr('id'));
			return;
		}

		var currentStageBtnId = $(this).attr('id');
		var nextStageBtnId = currentStageBtnId.substring(0, currentStageBtnId.length - 1);
		nextStageBtnId += nextStageNumber;
		var nextStageBtn = $('#' + nextStageBtnId);
		nextStageBtn.unbind('click');
		nextStageBtn.click(goToNextStage);

		var currentStageContent = $(this).parent().parent();
		var currentStageId = currentStageContent.attr('id');
		currentStageContent.hide();

		var currentStageStatus = currentStageContent.parent().find('.main_stage.current');
		var currentStageStatusId = currentStageStatus.attr('id');
		currentStageStatus.removeClass('current');
		currentStageStatus.addClass('done');

		var nextStageId = currentStageId.substring(0, currentStageId.length - 1);
		nextStageId += nextStageNumber;
		var nextStageContent = $('#' + nextStageId);
		nextStageContent.show();

		if(nextStageId == 'main_popup_agree_to_settle_stage2') {
			if($.globalUser) {
				$('.main_stage').removeClass('current');
				$('#main_popup_agree_to_settle_status_stage1').addClass('done');
				$('#main_popup_agree_to_settle_status_stage2').addClass('done');
				$('#main_popup_agree_to_settle_status_stage3').addClass('current');
				$('#main_popup_agree_to_settle_stage2').hide();
				$('#main_popup_agree_to_settle_stage3').show();
				$('#main_popup_agree_to_settle_btn_stage3').click(goToNextStage);
				$.validateRegistration = false;
			}
		}

		var nextStageStatusId = currentStageStatusId.substring(0, currentStageStatusId.length - 1);
		nextStageStatusId += nextStageNumber;
		nextStageStatus = $('#' + nextStageStatusId);
		nextStageStatus.addClass('current');
	}

	function getSendFormData(stageId) {
		var url = '';
		var popUp = stageId.substring(0, stageId.length - 7);
		var data = {};
		data.name = encodeURIComponent($('#' + popUp + '_name').val());
		data.email = $('#' + popUp + '_email').val();
		data.password = $('#' + popUp + '_password').val();

		if(stageId.indexOf('invite_other_side') != -1) {
			data.secondSide_name = encodeURIComponent($('#' + popUp + '_second_side_name').val());
			data.secondSide_email = $('#' + popUp + '_second_side_email').val();
			data.disputeTitle = encodeURIComponent($('#' + popUp + '_dispute_title').val());
			data.parties1_text = encodeURIComponent($('#' + popUp + '_dispute_text').val());
			data.disputeUserName = encodeURIComponent($('#' + popUp + '_dispute_name').val());
			if($.validateRegistration) {
				url = '/api/users/registerFirstSide/';
			}
			else {
				url = '/api/users/openDisputeFirstSide/';
			}
		}
		else if(stageId.indexOf('offer_solution') != -1) {
			url = '/api/users/register/';
		}
		else {
			data.parties2_text = encodeURIComponent($('#' + popUp + '_dispute_text').val());
			data.disputeUserName = encodeURIComponent($('#' + popUp + '_dispute_name').val());

			if($.validateRegistration) {
				url = '/api/users/registerSecondSide/';
			}
			else {
				url = '/api/users/openDisputeSecodeSide/';
			}
			
		    var query = String(window.location);
		    data.pass = query.substring((query.indexOf('=') + 1));
		    if(data.pass.indexOf('http') != -1) {
		    	data.pass = $('#main_popup_agree_to_settle_pass').val();
		    }
		}

		global.api(url, data, function(data) {
			if(data.indexOf('error') != -1) {
				alert(data);
			}
			else {
				location.href= '/#allDispute'
				$.cookie("session", data);
				location.href='/';
				// global.getUser();

				hidePopUp();
			}
		});
	}

	function getSendManageForm(e) {
		//e.preventDefault();
		hidePopUp();

		var name = $('#main_body_section_manage_name');
		var email = $('#main_body_section_manage_email');

		if(validateField(name)) {
			if(validateField(email)) {
				var data = {
					name: name.val(),
					email: email.val()
				};

				var url = '/api/users/mediatorRegister/'

				global.api(url, data, function(data) {
					sendMail()
				});
			}
		}
		else {
			return;
		}
	}

	function removeError() {
		$(this).removeClass('main_input_error');
	}

	function checkIfInvited() {
        if(location.href.toString().indexOf('?disputeId') > 0 || location.href.toString().indexOf('?gclid') > 0 ){
            return;
        }
        
        if(location.href.toString().indexOf('?page=1') > 0){
            $(".main_solve_dispute").click()
            return;
        }
        
        if(location.href.toString().indexOf('pass')==-1){
            return
        }
        
	    var query = String(window.location);
	    var pass = query.substring((query.indexOf('=') + 1));
	    var popUpToShow = 'main_popup_auto_invited_stage1';

	    if(pass.indexOf('http')) {
			setTimeout(function() {
				$(".main_agree_to_settle").click()
				$("#main_popup_agree_to_settle_pass").val(pass)
				$("#main_popup_agree_to_settle_btn_stage1").click()
			},1000)

            //var data = {};
            //data.pass = pass;
            //var url = '/api/users/checkDisputePass/';
            //
			//global.api(url, data, function(data) {
            //
			//		data = JSON.parse(data);
            //
			//		var checkDispute = data[0][0].checkDispute;
			//		if(checkDispute) {
			//			$('.main_username').html(decodeURIComponent(data[1][0].parties2_name));
			//			$('.main_invited_by_name').html(decodeURIComponent(data[1][0].parties1_name));
			//			$('.main_dispute_subject_subject').html(decodeURIComponent(data[1][0].title));
			//			showPopUp(popUpToShow);
			//		}
            //
			//});
	    }
	}

	function validateField(currentField) {
		var isValid = true;
		var currentFieldType = currentField.attr('type');
		var currentFieldValue = currentField.val();

		if(currentFieldValue == '') {
			isValid = false;
		}
		else if(currentFieldType == 'email') {
			isValid = validateEmail(currentFieldValue);
		}
		else if(currentFieldType == 'password') {
			isValid = validatePassword(currentField);
		}

		if(!isValid) {
			currentField.addClass('main_input_error');
		}

		return isValid;
	}

	function validateEmail(email) {
	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	    return re.test(email);
	}

	function validatePassword(currentField) {
		var isValid = true;
		var isFirstPassword = true;
		var currentFieldValue = currentField.val();
		var currentFieldId = currentField.attr('id');

		if(currentFieldValue.length < 4) {
			isValid = false;
		}

		if(currentField.attr('data-pass') == 'second') {
			isFirstPassword = false;
		}

		if(isFirstPassword) {
			var firstPassword = currentFieldValue;
			var secondPassword = $('#' + currentFieldId + '_second').val();
		}
		else {
			var firstPasswordId = currentFieldId.substring(0, currentFieldId.length - 7);
			var secondPassword = currentFieldValue;
			var firstPassword = $('#' + firstPasswordId).val();
		}

		if(firstPassword != secondPassword) {
			isValid = false;
		}

		return isValid;
	}

	function getLanguage() {
		global.getLanguage('main', function(xml) {
			xml = $(xml);
			echoLanguage(xml);
		})
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