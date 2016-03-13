var dispute = new disputeJs()
function disputeJs(){
	function ctor(){
		getLanguage();
		
		$('#dispute_main_chat_emotion_btn').click(function() {
			toggleFeelingPanel($(this).attr('id'));
		});
		$('#dispute_private_chat_emotion_btn').click(function() {
			toggleFeelingPanel($(this).attr('id'));
		});
		$('.dispute_feeling_panel_feeling_label').click(function() {
			selectFeelingFromPanel($(this));
		});
		$('.dispute_feeling_tooltip .dispute_feeling_panel_feeling_label').click(function() {
			onlyChangeFeeling = true;
			selectFeelingFromPanel($(this), onlyChangeFeeling);
		});
		$('.dispute_column_section_details_second').click(disputeDetailsToggle);
		$('.dispute_column_section_content_available_options_new_option').bind('input propertychange', function(e) {
			inspectChars(100, 'dispute_column_section_content_available_options_new_option');
			$('.dispute_column_section_content_available_options_new_option').on('keyup', function(e) {
				if(e.which == 13 && ! e.shiftKey) {
					bindBrainstormInput();
				}
			});
		});
		$('.dispute_initdispute_your_side_input').bind('input propertychange', function(e) {
			inspectChars(150, 'dispute_initdispute_your_side_input');
			$('.dispute_initdispute_your_side_input').on('keyup', function(e) {
				if(e.which == 13 && ! e.shiftKey) {
					bindSideTextInput(e);
				}
			});
		});
		$('.dispute_feeling_panel_feeling_label').click(function() {
			setMessageFeeling($(this));
		});
		$('.dispute_column_section_content_available_options_new_option_btn').click(bindBrainstormInput);
		$('.dispute_initdispute_submit_btn').click(bindSideTextInput);
		$(".dispute_popup_close, .dispute_popup_close_btn").click(closePopUp);
		$('.dispute_column_section_title_info').mouseenter(toggleTooltip).mouseleave(toggleTooltip);
		$('.dispute_header_the_sides_info').mouseenter(toggleTooltip).mouseleave(toggleTooltip);
		$('.dispute_mediator_menu').click(toggleMediatorMenu);
		$('.dispute_mediator_menu_main_item').click(openMediatorMenuItem);
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_container div').click(toggleMediatorMenuItemAddressCrowdSelection);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3 .dispute_mediator_menu_main_item_address_crowd_open_part_choices_container div').click(toggleMediatorMenuItemAddressCrowdSelectionEdit);
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').click(focusOnTagInput);
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag input').focusout(showTagPlaceholder);
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag input').focus(hideTagPlaceholder);
		$('#dispute_mediator_menu_main_item_address_crowd_open_btn').click(addressCrowdGoToStage2);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2_btn').click(addressCrowdGoToStage3);
		//$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').click(addressCrowdGoToStage3); /*zloof*/
		$('#dispute_mediator_menu_main_item_address_crowd_open_btn_edit').click(addressCrowdStage3AllowEdit);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').click(addressCrowdStage3Publish);
		$('#dispute_mediator_menu_main_item_notes_open_btn').click(publishMediatorNotes);
		$('.dispute_column_section_content_agreement_drag_here_mediator_send_btn').click(updateMediatorText);
		bindSlider('#dispute_time_remaining_slider');
		$('#dispute_mediator_menu_main_item_time_open_btn').click(setDisputeEndTime);
		$("#dispute_mediator_menu_main_item_disputes_label").click(goToMentorPage);
		$('.dispute_arrow_down').click(toggleHeaderFeelingPanel);

		$(".dispute_fb_btn").click(shareFacebook)


	}
	this.ctor = ctor;

	var disputeInterval;
	this.disputeInterval = disputeInterval;
	var privateChatInterval = '';
	this.privateChatInterval = privateChatInterval;
	var privateChatIntervalSecondChat = '';
	this.privateChatIntervalSecondChat = privateChatIntervalSecondChat;

	function showPage(){
        $(".dispute_column_section_content_available_options_new_option").val("")
        
		if($.globalUser == undefined){
			vmain.showPage()
			$(".main_click_offer_solution").click()
			$(".main_click_offer_solution").click()
		}
		else{
			global.globalHide();
			$(".global_page_dispute").show();

			$('.dispute_agreement_btn').unbind("click");
			$('.dispute_agreement_btn').click(toggleAgreement);

			getDispute(getDisputeId);

			clearInterval(disputeInterval)
			clearInterval(privateChatInterval)
			clearInterval(privateChatIntervalSecondChat)

			disputeInterval = setInterval(function(){
				getDispute(getDisputeId);
				showPrivateChatMessages(getDisputeId(), $.disoute_detials);
				bindPrivateChatToggle();
			},1000)
		}

		var url = location.href.toString()
		$(".dispute_fb_btn_label").attr('data-href',url);
	}
	this.showPage = showPage;

	function shareFacebook(){
		$(".fb-share-button").click()
	}

	function goToMentorPage(){
		location.href = "#mentor";
	}

	function getDisputeId() {
	    var query = String(window.location);
	    var disputeId = query.substring((query.indexOf('=') + 1));
	    return disputeId;
	}
	
	var firstData = '';
	function getDispute(disputeId) {
		var data = {'dispute_id': disputeId};
		var url = '/api/dispute/getDispute/';

		global.api(url, data, function(data) {
			data = JSON.parse(data);
			if(firstData != JSON.stringify(data)){
				console.log('new data');
				firstData = JSON.stringify(data);
				checkPermissions(data[0]);
				showDisputeDetails(data[0]);
				showAvailableOptions(data[2], data[0]);
				showChatMessages(data[1], data[0]);
				bindChatInputs(disputeId, data[0]);
				bindMediatorText(data[0])
				$.disoute_detials = data[0];
                
                checkBlockBrainstorm(data[4][0].counter);

               takeStatusPic(data[0][0].vstatus)
			}
		});
	}
    function takeStatusPic(vstatus){
        $("#dispute_header_feel1").attr('src','www/images/dispute/level' + vstatus + '.png');
    }
    
	$.disoute_detials;

    function checkBlockBrainstorm(counter){
        if(counter>4){
            $(".dispute_column_section_content_available_options_new_option").attr('placeHolder','כל משתמש יכול לשלוח עד 5 הצעות')
            $(".dispute_column_section_content_available_options_new_option").prop('disabled', true);
        }
        else{
            $(".dispute_column_section_content_available_options_new_option").attr('placeHolder','הפתרון שלי הוא...')
            $(".dispute_column_section_content_available_options_new_option").prop('disabled', false);
        }
    }
	function checkPermissions(details) {
		var parties1Id = details[0].parties1_id;
		var parties2Id = details[0].parties2_id;
		var mediatorId = details[0].mediator_id;

		$('.dispute_column_section_content_available_options_new_option_container').hide();

		if($.globalUser.id != parties1Id && $.globalUser.id != parties2Id && $.globalUser.id != mediatorId) { // user is guest
			$('#dispute_column_details').show();
			$('.dispute_column_section_content_available_options_new_option_container').show();
			$('#dispute_column_section_content_agreement_drag_here').prop('disabled', true);
			$('#dispute_column_section_content_avillable_options').addClass('guest');
			$('#dispute_column_main_chat').hide();
			$('.dispute_column_section_details_container').hide();
			$('.dispute_column_section_content_options_option_agree').hide();
			$('.dispute_private_chat_container').hide();
			$('.dispute_agreement_btn').prop('disabled', true);
			$('.dispute_agreement_btn').css('cursor', 'default');
			$('.dispute_agreement_btn').addClass('inactive');
			$('.dispute_column_section_content_facebook_share').show();

			global.getLanguage('dispute', function(xml) {
				xml = $(xml);
				var availableOptionsDecideDiv = $('#dispute_column_section_content_parties_selection_drag_here');
				var availableOptionsAgreeDiv = $('#dispute_column_section_content_agreement_drag_here');
				if(isLabelOnly(availableOptionsDecideDiv)) {
					availableOptionsDecideDiv.text(xml.find('leaf[name="dispute_column_section_content_parties_selection_drag_here_guest"]').text());
				}
				if(isLabelOnly(availableOptionsDecideDiv)) {
					availableOptionsAgreeDiv.text(xml.find('leaf[name="dispute_column_section_content_agreement_drag_here_guest"]').text());
				}
			});
		}
		else if($.globalUser.id == mediatorId) {
			// $('#dispute_column_details').show();
			$('.dispute_column_section_content_agreement_drag_here_mediator_send_btn').show();
			$('.dispute_mediator_menu').show();
			$('.dispute_column_section_content_available_options_new_option_container').show();
			$('#dispute_column_section_content_avillable_options').addClass('guest');
			$('.dispute_column_section_details_container').hide();
			$('.dispute_column_section_content_options_option_agree').hide();
			$('.dispute_private_chat_container').hide();
			$('#dispute_main_chat_emotion_btn').hide();
			$('.dispute_agreement_btn').addClass('inactive');
			$('.dispute_agreement_btn').prop('disabled', true);
			$('.dispute_agreement_btn').css('cursor', 'default');
			$('#dispute_private_chat_preview_second_chat').hide();
			$('#dispute_private_chat_preview').hide();
			$('#dispute_private_chat_preview_mediator').show();
		}
		else { // user is side in dispute
			$('#dispute_column_section_content_agreement_drag_here').prop('disabled', true);
			if($.globalUser.id == parties1Id) {
				$('#dispute_header_the_sides_side1_feel .dispute_arrow_down').show();
				$('#dispute_agreement_btn_side2').prop('disabled', true);
				$('#dispute_agreement_btn_side2').css('cursor', 'default');
				$('#dispute_agreement_btn_side2').addClass('dispute_agreement_btn_no_hover');
				if(details[0].parties1_firstAgree == 1) {
					$('#dispute_column_section_content_available_options').hide();
					$('#dispute_column_section_content_initdispute').show();
				}
			}
			else if($.globalUser.id == parties2Id) {
				$('#dispute_header_the_sides_side2_feel .dispute_arrow_down').show();
				$('#dispute_agreement_btn_side1').prop('disabled', true);
				$('#dispute_agreement_btn_side1').css('cursor', 'default');
				$('#dispute_agreement_btn_side1').addClass('dispute_agreement_btn_no_hover');
				if(details[0].parties2_firstAgree == 1) {
					$('#dispute_column_section_content_available_options').hide();
					$('#dispute_column_section_content_initdispute').show();
				}
			}
		}
	}

	function showDisputeDetails(details) {

		if(details[0].blockVotesBrain) {
			$('.dispute_column_section_content_available_options_new_option_container').hide();
		}

		$('.dispute_title').html(decodeURIComponent(details[0].title));
		$('#dispute_header_mediator_name').html(decodeURIComponent(details[0].mediator_name));
		
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_title').html(decodeURIComponent(details[0].title));
		var mediatorName = $('#dispute_column_section_content_details_mediator .dispute_column_section_content_details_block_name');
		var mediatorNameHeader = $('#dispute_header_mediator_name');
		var mediatorTextProblem =  $('#dispute_column_section_content_details_mediator .dispute_column_section_content_details_block_content');
		var parties1Name = $('#dispute_column_section_content_details_parties1 .dispute_column_section_content_details_block_name');
		var parties1NameHeader = $('#dispute_header_the_sides_side1');
		var parties1FeelHeader = $('#dispute_header_the_sides_side1_feel');
		var parties1TextProblem =  $('#dispute_column_section_content_details_parties1 .dispute_column_section_content_details_block_content');
		var parties1Feeling = $('#dispute_header_the_sides_side1_feel_label');
		var parties2Name = $('#dispute_column_section_content_details_parties2 .dispute_column_section_content_details_block_name');
		var parties2NameHeader = $('#dispute_header_the_sides_side2');
		var parties2TextProblem =  $('#dispute_column_section_content_details_parties2 .dispute_column_section_content_details_block_content');
		var parties2Feeling = $('#dispute_header_the_sides_side2_feel_label');
		mediatorName.html(decodeURIComponent(details[0].mediator_name));
		$('.dispute_initdispute_mediator_name').html(decodeURIComponent(details[0].mediator_name));
        var mediator_textProblem = details[0].mediator_textProblem;
        if(mediator_textProblem==null){
            mediator_textProblem = 'עדיין אין פניה לקהל';
        }
		mediatorTextProblem.html(decodeURIComponent(mediator_textProblem));
        
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_textarea_number_1').val(decodeURIComponent(details[0].mediator_textProblem));
		$('.dispute_initdispute_content_text').html(decodeURIComponent(details[0].mediator_textProblem));
		var selectedTag = parseMainTagToString(details[0].tag1);
		var activeTag = 'dispute_mediator_menu_main_item_address_crowd_open_part_choices_' + selectedTag;
		$('.'+ activeTag).addClass('dispute_mediator_menu_selected');

		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag1').val(details[0].tag2);
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag2').val(details[0].tag3);
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag3').val(details[0].tag4);

		$('#dispute_initdispute_mediator_content_tag_main').val(parseMainTagToString(details[0].tag1));
		$('#dispute_initdispute_mediator_content_tag_2').val(details[0].tag2);
		$('#dispute_initdispute_mediator_content_tag_3').val(details[0].tag3);
		$('#dispute_initdispute_mediator_content_tag_4').val(details[0].tag4);

		if($('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag1').val() != '') {
			$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag1').parent().find('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').hide();
		}
		if($('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag2').val() != '') {
			$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag2').parent().find('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').hide();
		}
		if($('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag3').val() != '') {
			$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag3').parent().find('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').hide();
		}

		mediatorNameHeader.html(details[0].mediator_name);
		
		var shareUrl = 'http://www.facebook.com/sharer/sharer.php?u=' + location.href;
		$('.dispute_fb_btn').attr('href', shareUrl);

		/* No tags shown
		mediatorTextProblem.append('<div class="dispute_column_section_content_details_mediator_tags_container">');
		for(var tag in details[0]) {
			if(details[0].hasOwnProperty(tag)) {
				if(tag.indexOf('tag') > -1) {
					mediatorTextProblem.append('<button class="dispute_column_section_content_details_mediator_tag">' + details[0][tag] + '</button>');
				}
			}
		}
		mediatorTextProblem.append('</div>');
		*/

		parties1Name.html(decodeURIComponent(details[0].parties1_name));
		$('.dispute_side1_name').html(decodeURIComponent(details[0].parties1_name));
		parties1NameHeader.html('"' + decodeURIComponent(details[0].parties1_name) + '"');
        var parties1_textProblem= details[0].parties1_textProblem
        if(parties1_textProblem==null){
            parties1_textProblem= 'עדיין אין פניה לקהל';
        }
		parties1TextProblem.html(decodeURIComponent(parties1_textProblem));
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_side1').val(decodeURIComponent(details[0].parties1_textProblem));
		//$(".dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_mediator").val(decodeURIComponent(details[0].mediator_FirstTextProblem))
		$('#dispute_mediator_menu_main_item_open_notes_textarea_side1').val(decodeURIComponent(details[0].mediator_note1));
		$('#dispute_mediator_menu_main_item_open_sides_textarea_side1').val(decodeURIComponent(details[0].parties1_FirstTextProblem));
		parties1Feeling.html('<span class="dispute_feeling_label_' + parseNumberToFeeling(details[0].parties1_feel) + '"></span>');
		parties1Feeling.css('background-image', 'www/images/dispute/feelings/undecided.png');
		parties2Name.html(decodeURIComponent(details[0].parties2_name));
		$('.dispute_side2_name').html(decodeURIComponent(details[0].parties2_name));
		parties2NameHeader.html('"' + decodeURIComponent(details[0].parties2_name) + '"');
        
        var parties2_textProblem = details[0].parties2_textProblem
        if(parties2_textProblem==null){
            parties2_textProblem = 'עדיין אין פניה לקהל';
        }
		parties2TextProblem.html(decodeURIComponent(parties2_textProblem));
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_side2').val(decodeURIComponent(details[0].parties2_textProblem));
		//$('#dispute_mediator_menu_main_item_open_notes_textarea_side1').val(decodeURIComponent(details[0].parties1_FirstTextProblem));
		$('#dispute_mediator_menu_main_item_open_sides_textarea_side2').val(decodeURIComponent(details[0].parties2_FirstTextProblem));
		parties2Feeling.html('<span class="dispute_feeling_label_' + parseNumberToFeeling(details[0].parties2_feel) + '"></span>');
		$('.dispute_mediator_name').html(details[0].mediator_name);


		var parties1FeelingImage = 'url(../www/images/dispute/feelings/' + parseNumberToFeeling(details[0].parties1_feel) + '.png)';
		var parties2FeelingImage = 'url(../www/images/dispute/feelings/' + parseNumberToFeeling(details[0].parties2_feel) + '.png)';

		$('#dispute_header_the_sides_feel_image_side1').css('background-image', parties1FeelingImage);
		$('#dispute_header_the_sides_feel_image_side2').css('background-image', parties2FeelingImage);

		reloadFeelingLabels();

		$('.dispute_agrrement_side1_name').html(decodeURIComponent(details[0].parties1_name));
		$('.dispute_agrrement_side2_name').html(decodeURIComponent(details[0].parties2_name));

		if(details[0].parties1_agree) {
			$('#dispute_agreement_btn_side1').addClass('active');
		}
		if(details[0].parties2_agree) {
			$('#dispute_agreement_btn_side2').addClass('active');
		}

		var timeLeftDate = new Date(details[0].date);
		initializeTimer(timeLeftDate);

		var disputeDetailsHTML = $('#dispute_column_section_content_details').html();
		$('#dispute_column_section_content_details_second').html(disputeDetailsHTML);
	}

	function bindMediatorText(details) {
		if(details[0].mediator_choiceText != null) {
			$('#dispute_column_section_content_agreement_drag_here').val(decodeURIComponent(details[0].mediator_choiceText));
		}
        else{
            if($.disputeXml==undefined){
                setTimeout(function(){
                    var text = ($.disputeXml.find('leaf[name="dispute_column_section_content_agreement_drag_here"]').text())
                    $('#dispute_column_section_content_agreement_drag_here').val(text);
                },1000)
            }
            else{
                var text = ($.disputeXml.find('leaf[name="dispute_column_section_content_agreement_drag_here"]').text())
                $('#dispute_column_section_content_agreement_drag_here').val(text);
            }
        }
	}

	function disputeDetailsToggle() {
		$('#dispute_column_section_content_details_second').toggle();
		$('#dispute_column_section_title_details_chevron').toggleClass('glyphicon glyphicon-menu-up');
		$('#dispute_column_section_title_details_chevron').toggleClass('glyphicon glyphicon-menu-down');
		$('#dispute_column_section_content_avillable_options').toggleClass('dispute_avillable_options_short');
	}

	var firstPrivateChatData = '';
	function showPrivateChatMessages(disputeId, details) {
		var data = {'id_dispute': disputeId};
		var url = '/api/dispute/getChatMessage/';

		global.api(url, data, function(data) {
			var privateChatMessages = JSON.parse(data);
			if(firstPrivateChatData != JSON.stringify(privateChatMessages)) {
				firstPrivateChatData = JSON.stringify(privateChatMessages);

				var privateChatMessagesDiv = $('#dispute_private_chat .dispute_private_chat_content');
				privateChatMessagesDiv.html('');

				var privateChatMessagesDivMediator1st = $('#dispute_private_chat_mediator_side1 .dispute_private_chat_content');
				privateChatMessagesDivMediator1st.html('');

				var privateChatMessagesDivMediator2nd = $('#dispute_private_chat_mediator_side2 .dispute_private_chat_content');
				privateChatMessagesDivMediator2nd.html('');

				var privateChatMessagesSecondDiv = $('#dispute_private_chat_second_chat .dispute_private_chat_content');
				privateChatMessagesSecondDiv.html('');

				var lastPrivateChatMessageId = '';
				var lastPrivateChatMessageIdSeen = '';
				var lastPrivateChatMessageIdSecondChat = '';
				var lastPrivateChatMessageIdSeenSeondChat = '';


				if($.globalUser.id == details[0].mediator_id) {
					for(var i = 0; i < privateChatMessages.length; i++) {
						var privateChatMessage = privateChatMessageCreator(privateChatMessages[i], details);

						if(privateChatMessages[i].mentorToUser) { // message if from mentor to user
							if(privateChatMessages[i].mentor_id == details[0].parties1_id) {
								privateChatMessagesDiv.append(privateChatMessage);
								privateChatMessagesDivMediator1st.append(privateChatMessage);
								if(lastPrivateChatMessageId == '') {
									lastPrivateChatMessageId = privateChatMessages[i].id;
								}
							}
							else {
								privateChatMessagesSecondDiv.append(privateChatMessage);
								privateChatMessagesDivMediator2nd.append(privateChatMessage);
								if(lastPrivateChatMessageIdSecondChat == '') {
									lastPrivateChatMessageIdSecondChat = privateChatMessages[i].id;
								}
							}
						}
						else { // message if from user to mentor
							if(privateChatMessages[i].users_id == details[0].parties1_id) {
								privateChatMessagesDiv.append(privateChatMessage);
								privateChatMessagesDivMediator1st.append(privateChatMessage);
								if(lastPrivateChatMessageId == '') {
									lastPrivateChatMessageId = privateChatMessages[i].id;
								}
							}
							else {
								privateChatMessagesSecondDiv.append(privateChatMessage);
								privateChatMessagesDivMediator2nd.append(privateChatMessage);
								if(lastPrivateChatMessageIdSecondChat == '') {
									lastPrivateChatMessageIdSecondChat = privateChatMessages[i].id;
								}
							}
						}
					}
				}
				else {
					for(var i = 0; i < privateChatMessages.length; i++) {
						var privateChatMessage = privateChatMessageCreator(privateChatMessages[i], details);
						privateChatMessagesDiv.append(privateChatMessage);
					}
					lastPrivateChatMessageId = privateChatMessages[0].id;
				}

				lastPrivateChatMessageIdSeen = localStorage.getItem('lastPrivateChatMessageIdSeen');
				lastPrivateChatMessageIdSeenSeondChat = localStorage.getItem('lastPrivateChatMessageIdSeenSeondChat');

				if($('#dispute_private_chat').css('display') == 'none') {
					if(lastPrivateChatMessageId > lastPrivateChatMessageIdSeen) {
						// $('#dispute_private_chat_preview .dispute_private_chat_new').show();
						privateChatInterval = setInterval(function() {
							$('#dispute_private_chat_preview').toggleClass("dispute_chat_preview_background");
						}, 1000);
					}
					else {
						$('#dispute_private_chat_preview .dispute_private_chat_new').hide();
						clearInterval(privateChatInterval);
						$('#dispute_private_chat_preview').removeClass("dispute_chat_preview_background");
					}
				}

				if($('#dispute_private_chat_second_chat').css('display') == 'none') {
					if(lastPrivateChatMessageIdSecondChat > lastPrivateChatMessageIdSeenSeondChat) {
						//$('#dispute_private_chat_preview_second_chat .dispute_private_chat_new').show();
						privateChatIntervalSecondChat = setInterval(function() {
							$('#dispute_private_chat_preview_second_chat').toggleClass("dispute_chat_preview_background");
						}, 1000);
					}
					else {
						$('#dispute_private_chat_preview_second_chat .dispute_private_chat_new').hide();
						clearInterval(privateChatIntervalSecondChat);
						$('#dispute_private_chat_preview_second_chat').removeClass("dispute_chat_preview_background");
					}
				}

				if($('#dispute_private_chat_mediator').css('display') == 'none') {
					console.log(lastPrivateChatMessageIdSecondChat + ' : ' + lastPrivateChatMessageIdSeenSeondChat);

					if(lastPrivateChatMessageIdSecondChat > lastPrivateChatMessageIdSeenSeondChat) {
						$('.dispute_private_chat_mediator_new.side2').show();
					}
					else {
						$('.dispute_private_chat_mediator_new.side2').hide();
					}
					if(lastPrivateChatMessageId > lastPrivateChatMessageIdSeen) {
						$('.dispute_private_chat_mediator_new.side1').show()
					}
					else {
						$('.dispute_private_chat_mediator_new.side1').hide();
					}
				}

				updateChatLanguage();
			}
		});
	}

	function privateChatMessageCreator(privateChatMessage, details) {
		// ** TODO: change this when server will return feelings for private messages
		var HTML = '';
		HTML += '<div class="dispute_column_section_content_chat_messages_message ' + isMediator(privateChatMessage.users_id, details) + '" id="dispute_private_chat_message_' + privateChatMessage.id + '">'
			 +	'<img class="' + isMediator(privateChatMessage.userWrite, details) + ' dispute_chat_message_feeling" src="www/images/dispute/feelings/' + parseNumberToFeeling(3) +'_white.png">'
			 +  '<span class="dispute_chat_message_writer">' + parseUsername(privateChatMessage.users_id, details, privateChatMessage.mentorToUser) + '</span>'
			 +		'<div class="dispute_column_section_content_chat_messages_message_content">' + decodeURIComponent(privateChatMessage.text) + '</div>'
			 +		'<div class="dispute_column_section_content_chat_messages_message_details">'
			 +			'<span class="dispute_chat_message_time">' + parseDate(privateChatMessage.date) + '</span>'
			 +		'</div>'
			 +	'</div>';
		return HTML;
	}

	function bindPrivateChatToggle() {
		$('#dispute_private_chat_preview').click(function() {
			$('#dispute_private_chat').toggle();
			$('#dispute_private_chat_preview .dispute_private_chat_preview_dash').toggleClass('active');
			$('#dispute_private_chat_preview .dispute_private_chat_new').hide();
			clearInterval(privateChatInterval);
			$('#dispute_private_chat_preview').removeClass("dispute_chat_preview_background");

			if($('#dispute_private_chat').css('display') != 'none') {
				var privateChatMessageId = $('#dispute_private_chat .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
				localStorage.setItem('lastPrivateChatMessageIdSeen', privateChatMessageId);
			}
		})

		$('#dispute_private_chat_preview_second_chat').click(function() {
			$('#dispute_private_chat_second_chat').toggle();
			$('#dispute_private_chat_preview_second_chat .dispute_private_chat_preview_dash').toggleClass('active');
			$('.dispute_private_chat_preview.second_chat').toggleClass('active');
			$('#dispute_private_chat_preview_second_chat .dispute_private_chat_new').hide();
			clearInterval(privateChatIntervalSecondChat);
			$('#dispute_private_chat_preview_second_chat').removeClass("dispute_chat_preview_background");

			if($('#dispute_private_chat_second_chat').css('display') != 'none') {
				var privateChatMessageIdSecondChat = $('#dispute_private_chat_second_chat .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
				localStorage.setItem('lastPrivateChatMessageIdSeenSeondChat', privateChatMessageIdSecondChat);
			}
		})

		$('#dispute_private_chat_preview_mediator').click(function() {
			$('#dispute_private_chat_mediator').toggle();
			$('.dispute_private_chat_preview_mediator_chat_with').toggle();
			$('.dispute_private_chat_mediator_label').toggle();
			$('#dispute_private_chat_preview_mediator .dispute_private_chat_preview_dash').toggleClass('active');
			$('.dispute_private_chat_mediator_new').hide();

			if($('#dispute_private_chat_preview_mediator').css('display') != 'none') {
				var privateChatMessageIdSecondChat = $('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
				console.log('2nd message seen: ' + privateChatMessageIdSecondChat);
				localStorage.setItem('lastPrivateChatMessageIdSeenSeondChat', privateChatMessageIdSecondChat);
				var privateChatMessageId = $('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
				console.log('1st message seen: ' + privateChatMessageId);
				localStorage.setItem('lastPrivateChatMessageIdSeen', privateChatMessageId);
			}
		});

		$('.dispute_private_chat_preview_mediator_chat_with.side1').click(function(event) {
			event.stopPropagation();
			$('.dispute_private_chat_preview_mediator_chat_with.side1').addClass('active');
			$('.dispute_private_chat_preview_mediator_chat_with.side2').removeClass('active');
			$('#dispute_private_chat_mediator_side2').hide();
			$('#dispute_private_chat_mediator_side1').show();
		})
		$('.dispute_private_chat_preview_mediator_chat_with.side2').click(function(event) {
			event.stopPropagation();
			$('.dispute_private_chat_preview_mediator_chat_with.side2').addClass('active');
			$('.dispute_private_chat_preview_mediator_chat_with.side1').removeClass('active');
			$('#dispute_private_chat_mediator_side1').hide();
			$('#dispute_private_chat_mediator_side2').show();
		})


	}

	function showChatMessages(chatMessages, details) {
		var chatMessagesDiv = $('.dispute_column_section_content_chat_messages');
		chatMessagesDiv.html('');

		for(var i = 0; i < chatMessages.length; i++) {
			var chatMessage = chatMessageCreator(chatMessages[i], details);
			chatMessagesDiv.append(chatMessage);
		}

		updateChatLanguage();
		reloadFeelingLabels();
	}

	function updateChatLanguage() {
		global.getLanguage('dispute', function(xml) {
			xml = $(xml);
            $.disputeXml = xml;
			$(".dispute_time_now").text(xml.find('leaf[name="dispute_time_now"]').text());
			$(".dispute_time_hours").text(xml.find('leaf[name="dispute_time_hours"]').text());
			$(".dispute_time_minutes").text(xml.find('leaf[name="dispute_time_minutes"]').text());
			$(".dispute_time_before").text(xml.find('leaf[name="dispute_time_before"]').text());
			$(".dispute_name_you").text(xml.find('leaf[name="dispute_name_you"]').text());
		});
	}

	function chatMessageCreator(chatMessage, details) {
		var HTML = '';
		var feeling = parseNumberToFeeling(chatMessage.feeling);
		HTML += '<div class="' + isMediator(chatMessage.userWrite, details) + ' dispute_column_section_content_chat_messages_message">'
			 +		'<img class="' + isMediator(chatMessage.userWrite, details) + ' dispute_chat_message_feeling" src="www/images/dispute/feelings/' + parseNumberToFeeling(chatMessage.feeling) +'_yellow.png">'
			 +      '<span class="dispute_chat_message_writer">' + parseUsername(chatMessage.userWrite, details) + '</span>'
			 +		'<div class="dispute_column_section_content_chat_messages_message_content">' + decodeURIComponent(chatMessage.text) + '</div>'
			 +		'<div class="dispute_column_section_content_chat_messages_message_details">'
			 +			'<span class="dispute_chat_message_time">' + parseDate(chatMessage.date) + '</span>'
			 +		'</div>'
			 +	'</div>';
		return HTML;
	}

	function isMediator(userId, disputeDetails) { // used to insert css class
		if(userId == disputeDetails[0].mediator_id) {
			return ' dispute_mediator_message';
		}
		else if(userId == disputeDetails[0].parties1_id) {
			return ' dispute_parties1_message';
		}
		else {
			return ' dispute_parties2_message';
		}
	}

	function parseUsername(userId, disputeDetails, mentorToUser) {
		var nameToReturn = '';
		var tempNameToReturn = '';
		var parties1Name = disputeDetails[0].parties1_name;
		var parties2Name = disputeDetails[0].parties2_name;
		var mediatorName = disputeDetails[0].mediator_name;

		if($.globalUser.id == userId) {
			nameToReturn = '<span class="dispute_name_you"></span>';
		}
		else if(mentorToUser) {
			nameToReturn = mediatorName;
		}
		else {
			for(var key in disputeDetails[0]) {
				if(disputeDetails[0].hasOwnProperty(key)) {
					if(key.indexOf('id') > -1 && disputeDetails[0][key] == userId) {
						if(key == 'parties1_id') {
							nameToReturn = parties1Name;
						}
						else if(key == 'parties2_id') {
							nameToReturn = parties2Name;
						}
						else {
							nameToReturn = mediatorName;
						}
					}
				}
			}
		}

		return decodeURIComponent(nameToReturn);
	}

	function parseDate(date) {
		var dateToReturn = '';
		var offset = new Date().getTimezoneOffset();
		var nowMilisecs = Date.parse(new Date());
		offsetMilisecs = offset * 60000;
		dateMilisecs = Date.parse(date);
		localDateMilisecs = dateMilisecs - offsetMilisecs;
		var localDate = new Date(localDateMilisecs);

		var day = localDate.getDate();
		var month = (localDate.getMonth() * 1) + 1;
		var year = localDate.getFullYear();
		var hours = localDate.getHours();
		var minutes = localDate.getMinutes();

		var timeDiff = (nowMilisecs - localDateMilisecs);
		var timeDiffHours = Math.floor((timeDiff/(1000*60*60)));

		if(timeDiffHours > 24) {
			dateToReturn = (day + '/' + month + '/' + year + ' ' +hours + ':' + minutes);
		}
		else {
			minutes = Math.floor((timeDiff/1000/60) % 60);
			// hours = Math.floor((timeDiff/(1000*60*60)) % 24);
			hours = Math.floor((timeDiff/(1000*60*60)) % 24) + 7; //mor add +7 to hours

			if(hours == 0 && minutes < 2) {
				dateToReturn = '<span class="dispute_time_now"></span>';
			}
			else if(hours == 0) {
				dateToReturn = ('<span class="dispute_time_before"></span> ' + minutes + ' <span class="dispute_time_minutes"></span>');
			}
			else {
				dateToReturn = ('<span class="dispute_time_before"></span> ' + hours + ' <span class="dispute_time_hours"></span> ' + minutes + ' <span class="dispute_time_minutes"></span>');
			}
		}

		return dateToReturn;
	}

	function bindChatInputs(disputeId, details) {
		var sendId = -1;
		if($.globalUser.id != details[0].mediator_id) {
			sendId = 0;
		}

		$('.dispute_column_section_content_chat_new_message.main_chat').on('keyup', function(e) {
			if(e.which == 13 && ! e.shiftKey) {
				sendMainChatMessage(disputeId, details);
			}
		});
		
		$('#dispute_main_chat_btn').unbind("click");
		$('#dispute_main_chat_btn').click(function() {
			sendMainChatMessage(disputeId, details);
		});

		$('.dispute_column_section_content_chat_new_message.private_chat').on('keyup', function(e) {
			if(e.which == 13 && ! e.shiftKey) {
				var isSecondChat = false;
				if(sendId != 0) {
					sendId = details[0].parties1_id;
				}
				sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
			}
		});

		$('#dispute_private_chat_btn').unbind("click");
		$('#dispute_private_chat_btn').click(function() {
			var isSecondChat = false;
			if(sendId != 0) {
				sendId = details[0].parties1_id;
			}
			sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
		});

		$('.dispute_column_section_content_chat_new_message.second_chat').on('keyup', function(e) {
			if(e.which == 13 && ! e.shiftKey) {
				var isSecondChat = true;
				if(sendId != 0) {
					sendId = details[0].parties2_id;
				}
				sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
			}
		});

		$('#dispute_private_chat_btn_second_chat').unbind("click");
		$('#dispute_private_chat_btn_second_chat').click(function() {
			var isSecondChat = true;
			if(sendId != 0) {
				sendId = details[0].parties2_id;
			}
			sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
		});

		// new meditaor chat handle
		$('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_new_message').on('keyup', function(e) {
			if(e.which == 13 && ! e.shiftKey) {
				var isSecondChat = false;
				if(sendId != 0) {
					sendId = details[0].parties1_id;
				}
				var message = $('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_new_message');
				sendPrivateChatMessage(sendId, disputeId, details, isSecondChat, message);
			}
		});

		$('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_new_message_btn').unbind("click");
		$('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_new_message_btn').click(function() {
			var isSecondChat = false;
			if(sendId != 0) {
				sendId = details[0].parties1_id;
			}
			var message = $('#dispute_private_chat_mediator_side1 .dispute_column_section_content_chat_new_message');
			sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
		});


		$('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_new_message').on('keyup', function(e) {
			if(e.which == 13 && ! e.shiftKey) {
				var isSecondChat = true;
				if(sendId != 0) {
					sendId = details[0].parties2_id;
				}
				var message = $('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_new_message');
				sendPrivateChatMessage(sendId, disputeId, details, isSecondChat, message);
			}
		});

		$('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_new_message_btn').unbind("click");
		$('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_new_message_btn').click(function() {
			var isSecondChat = true;
			if(sendId != 0) {
				sendId = details[0].parties2_id;
			}
			var message = $('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_new_message');
			sendPrivateChatMessage(sendId, disputeId, details, isSecondChat);
		});

		setChatLabel(details);
	}

	function sendMainChatMessage(disputeId, details) {
		var message = $('.dispute_column_section_content_chat_new_message.main_chat');
		var messageContent = message.val();
		
		if(messageContent.length > 0){
			var feeling = parseFeelingToNumber(message.attr('data-feeling'));
			message.val('');
			insertMessage(disputeId, encodeURIComponent(messageContent), details, feeling);
		}
	}

	function sendPrivateChatMessage(sendId, disputeId, details, isSecondChat, message) {
		if(message == null) {
			if(isSecondChat) {
				var message = $('#dispute_private_chat_second_chat .dispute_column_section_content_chat_new_message.second_chat');
			}
			else {
				var message = $('#dispute_private_chat .dispute_column_section_content_chat_new_message.private_chat');
			}
		}
		
		var messageContent = message.val();

		if(messageContent.length < 2) {
			message.val('');
			return;
		}

		message.val('');

		var feeling = parseFeelingToNumber(message.attr('data-feeling'));
		// ** TODO: change this when server will return feelings for private messages
		insertPrivateMessage(disputeId, encodeURIComponent(messageContent), details, sendId);

		if(isSecondChat) {
			var privateChatMessageIdSecondChat = $('#dispute_private_chat_mediator_side2 .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
			privateChatMessageIdSecondChat*=1;
			privateChatMessageIdSecondChat+=1;
			localStorage.setItem('lastPrivateChatMessageIdSeenSeondChat', privateChatMessageIdSecondChat);
		}
		else {
			var privateChatMessageId = $('#dispute_private_chat .dispute_column_section_content_chat_messages_message').attr('id').substring(29);
			privateChatMessageId*=1;
			privateChatMessageId+=1;
			localStorage.setItem('lastPrivateChatMessageIdSeen', privateChatMessageId);
		}
	}

	function setChatLabel(details) {
		var mediatorId = details[0].mediator_id;
		var parties1Id = details[0].parties1_id;
		var parties2Id = details[0].parties2_id;

		if($.globalUser.id != mediatorId) {			
			global.getLanguage('dispute', function(xml) {
				xml = $(xml);
				$(".dispute_mediator").text(xml.find('leaf[name="dispute_mediator"]').text());
				$(".dispute_private_chat_label_name").text(details[0].mediator_name);
			});
		}
		else {
			$(".dispute_private_chat_container").show()
			$('.dispute_private_chat_preview .second_chat').show();
			$(".dispute_private_chat_label_name").text(details[0].parties1_name);
			$(".dispute_private_chat_label_name.second_chat").text(details[0].parties2_name);
		}
	}

	function toggleFeelingPanel(clickedBtn) {
		$('#' + clickedBtn + ' img').toggle();
		$('#' + clickedBtn).toggleClass('active');

		if(clickedBtn.indexOf('main_chat') != -1) {
			$('#dispute_feeling_panel_main_chat').toggle();
		}
		else if(clickedBtn.indexOf('private_chat') != -1) {
			$('#dispute_feeling_panel_private_chat').toggle();
		}
		
	}

	function selectFeelingFromPanel(selectedFeeling, onlyChangeFeeling) {
		selectedFeelingId = selectedFeeling.attr('id');
		selectedFeelingClass = selectedFeeling.attr('class');

		if(selectedFeelingClass.indexOf('main_chat') != -1) {
			toggleFeelingPanel('dispute_main_chat_emotion_btn');
		}
		else if(selectedFeelingClass.indexOf('private_chat') != -1) {
			toggleFeelingPanel('dispute_private_chat_emotion_btn');
		}
		else if(selectedFeelingClass.indexOf('header') != -1) {
			$('#dispute_header_the_sides_side2_container .dispute_feeling_tooltip').hide();
			$('#dispute_header_the_sides_side1_container .dispute_feeling_tooltip').hide();
			var feeling = selectedFeelingClass.substring(43);
			var feelingNumber = parseFeelingToNumber(feeling);
			var disputeId = $.disoute_detials[0].id;
			var data = {dispute_id: disputeId, feel: feelingNumber};
			var url = '/api/dispute/changeFill/';
			global.api(url, data, function(data) {
				
			});
		}
	}

	function bindBrainstormInput() {
		var details = $.disoute_detials;
		var brainstorm = $('.dispute_column_section_content_available_options_new_option');
		var brainstormContent = brainstorm.val();

		if($("#dispute_checkbox_is_anonymous").prop('checked') == true){
			var anonimi = 1;
		}
		else{
			var anonimi = 0;
		}

		if(brainstormContent.length > 100) {
			alert('error: max 100 chars allowed');
			return;
		}
		else if(brainstormContent.length == 0){
			return;
		}

		brainstorm.val('');
		inspectChars(100, 'dispute_column_section_content_available_options_new_option');
		var disputeId = getDisputeId();

		insertBrainstorm(disputeId, encodeURIComponent(brainstormContent), details,anonimi);
	}

	function bindSideTextInput(e) {
		e.preventDefault();
		var details = $.disoute_detials;
		var sideText = $('.dispute_initdispute_your_side_input');
		var sideTextContent = sideText.val();

		if(sideTextContent.length > 150) {
			alert('error: max 25 chars allowed');
			return;
		}
		else if(sideTextContent.length == 0){
			return;
		}

		sideText.val('');
		inspectChars(150, 'dispute_initdispute_your_side_input');
		var disputeId = getDisputeId();

		var data = {dispute_id: disputeId, text: encodeURIComponent(sideTextContent)};
		var url = '/api/dispute/setPartiesText/';
		global.api(url, data, function(data) {
			location.reload();
		});
	}


	function insertMessage(disputeId, messageContent, details, feeling) {
		var data = {'id_dispute': disputeId, 'text': messageContent, feeling: feeling};
		var url = '/api/dispute/insertMessage/';
		
		global.api(url, data, function(data) {
			data = JSON.parse(data);
			showChatMessages(data, details);
			changeHeaderFeeling(details, feeling);
		});
	}

	function insertPrivateMessage(disputeId, messageContent, details, sendId) {
		// ** TODO: change this when server will return feelings for private messages
		var data = {'id_dispute': disputeId, send_id: sendId, 'text': messageContent};
		var url = '/api/dispute/insertChatMessage/';

		global.api(url, data, function(data) {
			data = JSON.parse(data);
			showPrivateChatMessages(disputeId, details);
			localStorage.setItem('lastPrivateChatMessageIdSeen', data[0].id);
		});
	}

	function changeHeaderFeeling(details, feeling) {
		var mediatorId = details[0].mediator_id;
		var parites1Id = details[0].parties1_id;
		var parites2Id = details[0].parties2_id;

		feelingString = parseNumberToFeeling(feeling);

		if($.globalUser.id == parites1Id) {
			$('#dispute_header_the_sides_side1_feel_label').html('<span class="dispute_feeling_label_' + feelingString + '"></span>');
		}
		else if($.globalUser.id == parites2Id) {
			$('#dispute_header_the_sides_side2_feel_label').html('<span class="dispute_feeling_label_' + feelingString + '"></span>');
		}

		if($.globalUser.id != mediatorId) {
			reloadFeelingLabels();
		}
	}

	function setMessageFeeling(selectedFeeling) {
		if(selectedFeeling.hasClass('main_chat')) {
			$('.dispute_feeling_panel_feeling_label.main_chat').removeClass('active');
			var background = $('.dispute_feeling_panel_feeling_label.main_chat').css('background-image');
			$('.dispute_feeling_panel_feeling_label.main_chat').css('background-image', background);
			$('#dispute_column_section_content_chat .dispute_column_section_content_chat_new_message.main_chat').attr('data-feeling', event.target.id);
		}
		else if(selectedFeeling.hasClass('private_chat')) {
			$('.dispute_feeling_panel_feeling_label.private_chat').removeClass('active');
			var background = $('.dispute_feeling_panel_feeling_label.private_chat').css('background-image');
			$('.dispute_feeling_panel_feeling_label.private_chat').css('background-image', background);
			$('.dispute_column_section_content_chat_new_message.private_chat').attr('data-feeling', event.target.id);
		}

		selectedFeeling.addClass('active');
		var backgroundHover = selectedFeeling.css('background-image');
		backgroundHover.concat()
		selectedFeeling.css('background-image', backgroundHover);

		if(selectedFeeling.hasClass('header')) {
			selectedFeeling.removeClass('active');
			var background = selectedFeeling.css('background-image');
			background = background.substring(0, background.length - 12);
			background += '.png")'
			selectedFeeling.css('background-image', background);
		}
	}

	function parseFeelingToNumber(feeling) {
		var feelingOnly = feeling.substring(22);
		var feelingNumber = 9;
		switch(feelingOnly) {
			case 'indifferent':
				feelingNumber = 1;
			break;
			case 'sorry':
				feelingNumber = 2;
			break;
			case 'offended': 
				feelingNumber = 3;
			break;
			case 'angry': 
				feelingNumber = 4;
			break;
			case 'guilty': 
				feelingNumber = 5;
			break;
			case 'love': 
				feelingNumber = 6;
			break;
			case 'ashamed': 
				feelingNumber = 7;
			break;
			case 'disappointed': 
				feelingNumber = 8;
			break;
			case 'undecided': 
				feelingNumber = 9;
			break;
			case 'jealous': 
				feelingNumber = 10;
			break;
			case 'hate': 
				feelingNumber = 11;
			break;
		}
		return feelingNumber;
	}

	function parseNumberToFeeling(feelingNumber) {
		var feelingString = 'undecided';
		switch(feelingNumber) {
			case 1:
				feelingString = 'indifferent';
			break;
			case 2:
				feelingString = 'sorry';
			break;
			case 3:
				feelingString = 'offended';
			break;
			case 4: 
				feelingString = 'angry';
			break;
			case 5: 
				feelingString = 'guilty';
			break;
			case 6: 
				feelingString = 'love';
			break;
			case 7: 
				feelingString = 'ashamed';
			break;
			case 8: 
				feelingString = 'disappointed';
			break;
			case 9: 
				feelingString = 'undecided';
			break;
			case 10: 
				feelingString = 'jealous';
			break;
			case 11: 
				feelingString = 'hate';
			break;
		}
		return feelingString;
	}

	function reloadFeelingLabels() {
		global.getLanguage('dispute', function(xml) {
			xml = $(xml);
			$(".dispute_feeling_label_indifferent").text(xml.find('leaf[name="dispute_feeling_label_indifferent"]').text());
			$(".dispute_feeling_label_offended").text(xml.find('leaf[name="dispute_feeling_label_offended"]').text());
			$(".dispute_feeling_label_sorry").text(xml.find('leaf[name="dispute_feeling_label_sorry"]').text());
			$(".dispute_feeling_label_angry").text(xml.find('leaf[name="dispute_feeling_label_angry"]').text());
			$(".dispute_feeling_label_guilty").text(xml.find('leaf[name="dispute_feeling_label_guilty"]').text());
			$(".dispute_feeling_label_love").text(xml.find('leaf[name="dispute_feeling_label_love"]').text());
			$(".dispute_feeling_label_ashamed").text(xml.find('leaf[name="dispute_feeling_label_ashamed"]').text());
			$(".dispute_feeling_label_disappointed").text(xml.find('leaf[name="dispute_feeling_label_disappointed"]').text());
			$(".dispute_feeling_label_undecided").text(xml.find('leaf[name="dispute_feeling_label_undecided"]').text());
			$(".dispute_feeling_label_hate").text(xml.find('leaf[name="dispute_feeling_label_hate"]').text());
			$(".dispute_feeling_label_jealous").text(xml.find('leaf[name="dispute_feeling_label_jealous"]').text());
		})
	}

	function insertBrainstorm(disputeId, brainstormContent, details, anonimi) {
		var data = {
			'id_dispute': disputeId, 
			'title': brainstormContent, 
			'text': '',
			anonimi: anonimi
		};
		
		var url = '/api/dispute/insertBrainstorm/';

		global.api(url, data, function(data) {
			data = JSON.parse(data);
			// showAvailableOptions(data, details);
			var id = getDisputeId();
			getDispute(id);
		});
	}

	function showAvailableOptions(availableOptions, details) {
		var availableOptionsDiv = $('.dispute_column_section_content_options');
		var availableOptionsDecideDiv = $('#dispute_column_section_content_parties_selection_drag_here');
		var availableOptionsAgreeDiv = $('#dispute_column_section_content_agreement_drag_here');
		var optionToCancelDrag = [];
		var j = 0;

		availableOptionsDiv.html('');
		global.getLanguage('dispute', function(xml) {
			xml = $(xml);
			$("#dispute_column_section_content_parties_selection_drag_here").text(xml.find('leaf[name="dispute_column_section_content_parties_selection_drag_here"]').text());
			$("#dispute_column_section_content_agreement_drag_here").text(xml.find('leaf[name="dispute_column_section_content_agreement_drag_here"]').text());

			for(var i = 0; i < availableOptions.length; i++) {
				var availableOption = availableOptionCreator(availableOptions[i]);
				var availableOptionId = availableOptions[i].id;
				var availableOptionPlace = availableOptions[i].place;
				var availableOptionUserMove = availableOptions[i].usersMove_id;

				// if(availableOptionPlace != 2) {
					availableOptionsDiv.append(availableOption);
				// }
				if(availableOptionPlace == 1 || availableOptionPlace == 2) {
					// check if this created by current user, so he can't drag is own option
					if(availableOptionUserMove == $.globalUser.id) {
						optionToCancelDrag[j++] = $('#option_' + availableOptionId);
					}
					// add label if option div is empty
					if(isLabelOnly(availableOptionsDecideDiv)) {
						availableOptionsDecideDiv.html('<div class="dispute_parties_selection_side_choice side1" id="dispute_column_section_content_parties_selection_drag_here_parties' + $.disoute_detials[0].parties1_id + '"><span class="dispute_suggest_by">בחירת</span> ' + decodeURIComponent($.disoute_detials[0].parties1_name) + '</div>');
                        
						availableOptionsDecideDiv.append('<div class="dispute_parties_selection_side_choice side2" id="dispute_column_section_content_parties_selection_drag_here_parties' + $.disoute_detials[0].parties2_id + '"><span class="dispute_suggest_by">בחירת</span> ' + decodeURIComponent($.disoute_detials[0].parties2_name)  +'</div>');
						var usersDivToApped = $('#dispute_column_section_content_parties_selection_drag_here_parties' + availableOptionUserMove);
						usersDivToApped.append(availableOption);
                        
                        if(availableOptions[i].usersMove1_id!=null){
                            var usersDivToApped = $('#dispute_column_section_content_parties_selection_drag_here_parties' + availableOptions[i].usersMove1_id);
                            usersDivToApped.append(availableOption);
                        }
					}
					else {
						var usersDivToApped = $('#dispute_column_section_content_parties_selection_drag_here_parties' + availableOptionUserMove);
						usersDivToApped.append(availableOption);
					}
				}
				else if(availableOptionPlace == 2) {
					if(isLabelOnly(availableOptionsAgreeDiv)) {
						availableOptionsAgreeDiv.html(decodeURIComponent(availableOptions[i].title));					
					}
					else {
						availableOptionsAgreeDiv.append(availableOption);
					}
				}
			}

			$('.dispute_option_agree').text(xml.find('leaf[name="dispute_option_agree"]').text());
			$(".dispute_votes_label").text(xml.find('leaf[name="dispute_votes_label"]').text());
			$(".dispute_the_writer").text(xml.find('leaf[name="dispute_the_writer"]').text());

			isLabelOnly(availableOptionsDecideDiv);
			isLabelOnly(availableOptionsAgreeDiv);
			unbindAgrees();
			bindDraggableDroppable($.disoute_detials);
			cancelDrag(optionToCancelDrag);
			bindVotes();
			bindAgrees();
		});
	}

	function droppedItem(event, ui) {
		var droppableTarget = '';
		var droppableId = $(this).attr('id');
		var insertTarget = '' // will be Decide or Agree
		// ui.draggable.hide()
		
		if(droppableId == 'dispute_column_section_content_parties_selection') {
			droppableTarget = $('#dispute_column_section_content_parties_selection_drag_here');
			insertTarget = 'decide';
		}
		else {
			droppableTarget = $('#dispute_column_section_content_agreement_drag_here');
			insertTarget = 'agree';
		}

		if(isLabelOnly(droppableTarget)) {
			droppableTarget.html('');
		}

		var draggableId = ui.draggable.attr('id');
		var draggableHTML = '<div class="dispute_column_section_content_options_option" id="option_' + draggableId + '">';
		draggableHTML += ui.draggable.html();
		draggableHTML += '</div';
		ui.draggable.remove();
		droppableTarget.append(draggableHTML);

		var idDisputeBrainstorm = draggableId.substring('7'); // extract id only from div

		var data = {'id_disputeBrainstorm': idDisputeBrainstorm};
		var url = '';

		if(insertTarget == 'decide') {
			url = '/api/dispute/insertDecide/';
		}
		else { // insertTarget == agree
			url = '/api/dispute/insertAgree/';
		}

		global.api(url, data, function(data) {
		});

		var optionAgree = $('#option_agree_' + idDisputeBrainstorm);
		var optionUserMove = optionAgree.attr('data-user-move');

		if(optionUserMove > 0 && optionUserMove != $.globalUser.id) {
			$('.dispute_popup_container').show();
		}

		unbindVote(idDisputeBrainstorm);
		unbindAgrees();
		bindDraggableDroppable($.disoute_detials);
		bindVotes();
		bindAgrees();
		injectLabels();
	}

	function cancelDrag(options) {
		for(var i = 0; i < options.length; i++) {
			options[i].draggable('disable');
		}
	}

	function mentorDrop(event,ui){
		var text = ui.draggable.find(".dispute_column_section_content_options_option_content").text()
		$("#dispute_column_section_content_agreement_drag_here").val(text);

		var url = '/api/dispute/insertAgree/';
		var draggableId = ui.draggable.attr('id');
		var idDisputeBrainstorm = draggableId.substring('7');
		var data = {'id_disputeBrainstorm': idDisputeBrainstorm};
		
		global.api(url, data, function(data) {
		});
	}

	function mentorResetBrainstorm(event, ui) {
		var draggableId = ui.draggable.attr('id');
		var draggableParentId = $('#' + draggableId).parent().attr('id');
		var idDisputeBrainstorm = draggableId.substring('7');
		var draggedFrom = ($(ui.draggable).parent().attr('id'));

		if(draggedFrom.indexOf('parties_selection') != -1) {
			var url = '/api/dispute/removeBrainstorm/';
			var data = {'id_disputeBrainstorm': idDisputeBrainstorm};

			global.api(url, data, function(data) {
			});
		}
	}
	
	function bindDraggableDroppable(details) {
		var availableOptionsAgreeDiv = $('#dispute_column_section_content_agreement_drag_here');

		$('.dispute_column_section_content_options_option').draggable({
			revert: 'invalid',
			helper: 'clone',
			appendTo: 'body'
		});

		var mediatorId = details[0].mediator_id;
		var parties1Id = details[0].parties1_id;
		var parties2Id = details[0].parties2_id;
		
		if(mediatorId == $.globalUser.id){
			$('#dispute_column_section_content_agreement_drag_here').droppable({
				accept: '.dispute_column_section_content_options_option',
				drop: mentorDrop
			});

			$('#dispute_column_section_content_avillable_options').droppable({
				accept: '.dispute_column_section_content_options_option',
				drop: mentorResetBrainstorm
			});
		}
		
		if(details != undefined && mediatorId != $.globalUser.id) {
			if(mediatorId == $.globalUser.id) { // allow to drag to agree section if mediator
				$('#dispute_column_section_content_agreement').droppable({
					accept: '.dispute_column_section_content_options_option',
					drop: droppedItem
				});
				// disallow to drag anything if mediator
				$('#dispute_column_section_content_agreement .dispute_column_section_content_options_option').draggable('disable');
				$('#dispute_column_section_content_avillable_options .dispute_column_section_content_options_option').draggable('disable');
			}
			else {				
				$('#dispute_column_section_content_parties_selection').droppable({
					accept: '.dispute_column_section_content_options_option',
					drop: droppedItem
				});
				// disallow to drag from agree and decide section
				$('#dispute_column_section_content_agreement .dispute_column_section_content_options_option').draggable('disable');
				$('#dispute_column_section_content_parties_selection .dispute_column_section_content_options_option').draggable('disable');
				
				if(parties1Id != $.globalUser.id && parties2Id != $.globalUser.id) { 
					// user is guest in this dispute so he can't drag anything
					$('.dispute_column_section_content_options_option').draggable('disable');
					$('.dispute_agreement_btn').removeClass("dispute_agreement_btn_active");
				}
			}

			if(mediatorId == $.globalUser.id && isLabelOnly(availableOptionsAgreeDiv)) {
				$('#dispute_column_section_content_agreement').droppable({
					accept: '.dispute_column_section_content_options_option',
					drop: droppedItem
				});
			}
		}
	}

	function bindVotes() {
		$('.dispute_votable').click(function() {
			var optionVoteId = $(this).attr('id').substring(12);
			var disputeId = getDisputeId();

			var data = {'id_dispute': disputeId, 'id_disputeBrainstorm': optionVoteId};
			url = '/api/dispute/insertVote/';

			global.api(url, data, function(data) {
				if(data != 'success') {
					alert(data);
				}
				else {
					var totalVotes = $('#option_vote_' + optionVoteId + ' .dispute_column_section_content_options_option_votes_counter');
					var totalVotesNum = totalVotes.html();
					totalVotesNum++;
					totalVotes.html(totalVotesNum);
				}
			});
		});
	}

	function bindAgrees() { // Currently disabled because of flow change, agreement is by 2 buttons at botom of page
		var agrees = $('#dispute_column_section_content_parties_selection .dispute_column_section_content_options_option_agree');

		// check if the user is guest in this dispute
		var isGuest = $('#dispute_column_details').css('display');
		if(isGuest == 'none') {
			agrees.unbind('click');
			agrees.each(function() {
				var userMove = $(this).attr('data-user-move');
				if(userMove != $.globalUser.id) {
					$(this).click(function() {
						alert('**** Agreement ***');
					});
					$(this).show();
				}
			})
		}
	}

	function unbindVote(availableOptionId) {
		var availableOptionVote = $('#option_vote_' + availableOptionId);
		availableOptionVote.removeClass('dispute_votable');
		availableOptionVote.unbind('click');
	}

	function unbindAgrees() {
		var availableOptionAgree = $('.dispute_column_section_content_options_option_agree');
		availableOptionAgree.hide();
	}

	function availableOptionCreator(availableOption) {

		if (availableOption.anonimi==1){
			var name = $.dispute_xml.find('leaf[name="anonimi"]').text();
		}
		else{
			var name = availableOption.firstName //+ ' ' + availableOption.lastName
		}

		var HTML = '';
		HTML +=  '<div class="dispute_column_section_content_options_option" id="option_' + availableOption.id + '">'
				+	'<div id="option_vote_' + availableOption.id + '" class="' + isVotable(availableOption.place) + ' dispute_column_section_content_options_option_votes">'
				+		'<span class="dispute_votable_triangle glyphicon glyphicon-triangle-top"></span>'
				+		'<span class="dispute_column_section_content_options_option_votes_counter">' + availableOption.votes + '</span> <br>'
				+		'<span class="dispute_votes_label"></span>'
				+	'</div>'
				+	'<div class="dispute_column_section_content_options_option_content">' + decodeURIComponent(availableOption.title) + '</div>'
				+	'<div class="dispute_column_section_content_options_option_agree" data-user-move="' + availableOption.usersMove_id + '" id="option_agree_' + availableOption.id + '"> <span class="dispute_option_agree"></span> </div>'
				+	'<div class="dispute_column_section_content_options_option_isnew"></div>'
				+	'<div class="dispute_column_section_content_options_option_writer"><span class="dispute_the_writer"></span>' + decodeURIComponent(name) + '</div>'
				+ '</div>';
		return HTML;
	}

	function isVotable(availableOptionPlace) { // determine if user can vote for this option, not been dragged yet
		var isGuest = $('#dispute_column_details').css('display');

		if(availableOptionPlace == 0 && isGuest != 'none' && !$.disoute_detials[0].blockVotesBrain) {
			return 'dispute_votable';
		}
		else {
			return '';
		}
	}

	function toggleAgreement(event) {
		var btnId = event.target.id;
		$('#' + btnId).addClass('active');
		var disputeId = getDisputeId();

		var data = {'dispute_id': disputeId};
		url = '/api/dispute/agreeDecide/';

		global.api(url, data, function(data) {
			if(data != 'success') {
				alert(data);
			}
		});

		var side1Agree = $('#dispute_agreement_btn_side1').hasClass('active');
		var side2Agree = $('#dispute_agreement_btn_side2').hasClass('active');
	}

	function toggleHeaderFeelingPanel(event) {
		var parentId = $(this).parent().parent().attr('id');
		$('#' + parentId + ' .dispute_feeling_tooltip').toggle();
	}

	function toggleTooltip(event) {
		var infoBtnId = event.target.id;
		var infoBtnIdPosition = $('#' + infoBtnId).position();
		var tooltipId = infoBtnId += '_tooltip';
		$('#' + tooltipId).toggle();
	}

	function updateMediatorText() {
		var text = encodeURIComponent($('#dispute_column_section_content_agreement_drag_here').val());
		var data = {'dispute_id': $.disoute_detials[0].id, text: text};
		url = '/api/dispute/updateMediatorText/';

		global.api(url, data, function(data) {
		});
	}

	function getLanguage() {
		global.getLanguage('dispute', function(xml) {
			xml = $(xml);
			$.dispute_xml = xml

			echoLanguage(xml);
		})
	}
	
	function echoLanguage(xml) {		
		$(".dispute_title").text(xml.find('leaf[name="title"]').text());
		$(".dispute_header_status_label").text(xml.find('leaf[name="dispute_header_status_label"]').text());
		$("#dispute_header_the_sides_label").text(xml.find('leaf[name="dispute_header_the_sides_label"]').text());
		$("#dispute_header_mediator_name_label").text(xml.find('leaf[name="dispute_header_mediator_name_label"]').text());
		$("#dispute_time_left_label").text(xml.find('leaf[name="dispute_time_left_label"]').text());
		$("#dispute_column_section_title_chat_label").text(xml.find('leaf[name="dispute_column_section_title_chat"]').text());
		$(".dispute_column_section_content_chat_new_message_btn_text").text(xml.find('leaf[name="dispute_column_section_content_chat_new_message_btn_text"]').text());
		$(".dispute_column_section_content_chat_new_message_emotion_btn_text").text(xml.find('leaf[name="dispute_column_section_content_chat_new_message_emotion_btn_text"]').text());
		$(".dispute_column_section_content_available_options_new_option_btn").text(xml.find('leaf[name="dispute_column_section_content_available_options_new_option_btn"]').text());
		$(".dispute_column_section_title_details").text(xml.find('leaf[name="dispute_column_section_title_details"]').text());
		$("#dispute_column_section_title_details_label").text(xml.find('leaf[name="dispute_column_section_title_details"]').text());
		$("#dispute_column_section_title_available_options_label").text(xml.find('leaf[name="dispute_column_section_title_available_options"]').text());
		$("#dispute_column_section_title_parties_selection_label").text(xml.find('leaf[name="dispute_column_section_title_parties_selection"]').text());
		$("#dispute_column_section_title_agreement_label").text(xml.find('leaf[name="dispute_column_section_title_agreement"]').text());
		$(".dispute_agreement_btn").text(xml.find('leaf[name="dispute_agreement_btn"]').text());
		$("#dispute_column_section_content_parties_selection_drag_here").text(xml.find('leaf[name="dispute_column_section_content_parties_selection_drag_here"]').text());
		$("#dispute_column_section_content_agreement_drag_here").text(xml.find('leaf[name="dispute_column_section_content_agreement_drag_here"]').text());
		$(".dispute_column_section_content_chat_new_message").attr('placeholder', xml.find('leaf[name="dispute_column_section_content_chat_new_message"]').text());
		$(".dispute_column_section_content_available_options_new_option").attr('placeholder', xml.find('leaf[name="dispute_column_section_content_available_options_new_option"]').text());
		$(".dispute_column_section_content_details_block_btn.publish").text(xml.find('leaf[name="dispute_column_section_content_details_block_btn_publish"]').text());
		$(".dispute_column_section_content_details_block_btn.reply").text(xml.find('leaf[name="dispute_column_section_content_details_block_btn_reply"]').text());
		$(".dispute_time_now").text(xml.find('leaf[name="dispute_time_now"]').text());
		$(".dispute_column_section_content_chat_new_message_bottom_chars_label").text(xml.find('leaf[name="dispute_column_section_content_chat_new_message_bottom_chars_label"]').text());
		$(".dispute_column_section_content_chat_new_message_bottom_chars_label_end").text(xml.find('leaf[name="dispute_column_section_content_chat_new_message_bottom_chars_label_end"]').text());
		$(".dispute_time_hours").text(xml.find('leaf[name="dispute_time_hours"]').text());
		$(".dispute_time_minutes").text(xml.find('leaf[name="dispute_time_minutes"]').text());
		$(".dispute_time_before").text(xml.find('leaf[name="dispute_time_before"]').text());
		$(".dispute_name_you").text(xml.find('leaf[name="dispute_name_you"]').text());
		$(".dispute_private_chat_label").text(xml.find('leaf[name="dispute_private_chat_label"]').text());
		$("label[for='dispute_checkbox_is_anonymous']").text(xml.find('leaf[name="dispute_new_option_is_anonymous"]').text());
		$(".dispute_feeling_label_indifferent").text(xml.find('leaf[name="dispute_feeling_label_indifferent"]').text());
		$(".dispute_feeling_label_offended").text(xml.find('leaf[name="dispute_feeling_label_offended"]').text());
		$(".dispute_feeling_label_sorry").text(xml.find('leaf[name="dispute_feeling_label_sorry"]').text());
		$(".dispute_feeling_label_angry").text(xml.find('leaf[name="dispute_feeling_label_angry"]').text());
		$(".dispute_feeling_label_guilty").text(xml.find('leaf[name="dispute_feeling_label_guilty"]').text());
		$(".dispute_feeling_label_love").text(xml.find('leaf[name="dispute_feeling_label_love"]').text());
		$(".dispute_feeling_label_ashamed").text(xml.find('leaf[name="dispute_feeling_label_ashamed"]').text());
		$(".dispute_feeling_label_disappointed").text(xml.find('leaf[name="dispute_feeling_label_disappointed"]').text());
		$(".dispute_feeling_label_undecided").text(xml.find('leaf[name="dispute_feeling_label_undecided"]').text());
		$(".dispute_feeling_label_hate").text(xml.find('leaf[name="dispute_feeling_label_hate"]').text());
		$(".dispute_feeling_label_jealous").text(xml.find('leaf[name="dispute_feeling_label_jealous"]').text());
		$(".dispute_header_feeling_label").text(xml.find('leaf[name="dispute_feeling_label_undecided"]').text());
		$(".dispute_options_match").text(xml.find('leaf[name="dispute_options_match"]').text());
		$(".dispute_mediator_menu_label").text(xml.find('leaf[name="dispute_mediator_menu_label"]').text());
		$("#dispute_mediator_menu_main_item_notes_open_title").text(xml.find('leaf[name="dispute_mediator_menu_main_item_notes_open_title"]').text());
		$("#dispute_mediator_menu_main_item_notes_open_subtitle").text(xml.find('leaf[name="dispute_mediator_menu_main_item_notes_open_subtitle"]').text());
		$("#dispute_mediator_menu_main_item_sides_open_title").text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_open_title"]').text());
		$("#dispute_mediator_menu_main_item_sides_open_subtitle").text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_open_subtitle"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_status_title_stage1').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_status_title_stage1"]').text());
		$('.dispute_mediator_menu_main_item_open_status_title_almost_completed').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_title_almost_completed"]').text());
		$('#dispute_mediator_menu_main_item_open_status_1').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_1"]').text());
		$('#dispute_mediator_menu_main_item_open_status_2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_2"]').text());
		$('#dispute_mediator_menu_main_item_open_status_3').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_3"]').text());
		$('#dispute_mediator_menu_main_item_notes_open_btn').text(xml.find('leaf[name="dispute_mediator_menu_main_item_notes_open_btn"]').text());
		$('#dispute_mediator_menu_main_item_sides_open_btn').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_open_btn"]').text());
		$('.dispute_about_label').text(xml.find('leaf[name="dispute_about_label"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_title').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_title"]').text());
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_accomodation_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_choices_accomodation_label"]').text());
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_virtual_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_choices_virtual_label"]').text());
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_commercial_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_choices_commercial_label"]').text());
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_relations_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_choices_relations_label"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_subtitle_2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_subtitle_2"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_status_title_stage2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_status_title_stage2"]').text());
		$('.dispute_mediator_menu_main_item_open_status_title_waiting_for_mentor').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_title_waiting_for_mentor"]').text());
		$('#dispute_mediator_menu_main_item_open_stage3_status_1').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_1"]').text());
		$('#dispute_mediator_menu_main_item_open_stage3_status_2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_2"]').text());
		$('#dispute_mediator_menu_main_item_open_stage3_status_3').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_status_3"]').text());
		$('#dispute_mediator_menu_main_item_notes_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_notes_label"]').text());
		$('#dispute_mediator_menu_main_item_disputes_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_disputes_label"]').text());
		$('#dispute_mediator_menu_main_item_time_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_time_label"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_label"]').text());
		$('#dispute_mediator_menu_main_item_sides_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_label"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_3').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_3"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_subtitle_3').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_subtitle_3"]').text());
		$('#dispute_mediator_menu_main_item_sides_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_label"]').text());
		$('#dispute_mediator_menu_main_item_sides_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_label"]').text());
		$('#dispute_mediator_menu_main_item_sides_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_label"]').text());
		$('#dispute_mediator_menu_main_item_sides_label').text(xml.find('leaf[name="dispute_mediator_menu_main_item_sides_label"]').text());
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder"]').text());
		$('.dispute_mediator_menu_edit').text(xml.find('leaf[name="dispute_mediator_menu_edit"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_subtitle').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_subtitle"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_1').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_1"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_part_title_number_label_2"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2_title').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_stage2_title"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2_subtitle').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_stage2_subtitle"]').text());
		$('#dispute_mediator_menu_main_item_open_stage2_status_1').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_stage2_status_1"]').text());
		$('#dispute_mediator_menu_main_item_open_stage2_status_2').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_stage2_status_2"]').text());
		$('#dispute_mediator_menu_main_item_open_stage2_status_3').text(xml.find('leaf[name="dispute_mediator_menu_main_item_open_stage2_status_3"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2_btn').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_stage2_btn"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_subtitle').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_stage3_subtitle"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_btn_edit').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_btn_edit"]').text());
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').text(xml.find('leaf[name="dispute_mediator_menu_main_item_address_crowd_open_stage3_btn"]').text());
		$('#dispute_mediator_menu_main_item_time_open_title').text(xml.find('leaf[name="dispute_mediator_menu_main_item_time_open_title"]').text());
		$('#dispute_mediator_menu_main_item_time_open_btn').text(xml.find('leaf[name="dispute_mediator_menu_main_item_time_open_btn"]').text());
		$('#dispute_mediator_menu_main_item_time_open_subtitle').text(xml.find('leaf[name="dispute_mediator_menu_main_item_time_open_subtitle"]').text());
		$('#dispute_your_selection').text(xml.find('leaf[name="dispute_your_selection"]').text());
		$('.dispute_hours').text(xml.find('leaf[name="dispute_hours"]').text());
		$('.dispute_initdispute_title').text(xml.find('leaf[name="dispute_initdispute_title"]').text());
		$('.dispute_initdispute_subtitle').text(xml.find('leaf[name="dispute_initdispute_subtitle"]').text());
		$('.dispute_initdispute_adress_crowd').text(xml.find('leaf[name="dispute_initdispute_adress_crowd"]').text());
		$('#dispute_time_remaining_label').text(xml.find('leaf[name="dispute_time_remaining_label"]').text());
		$('.dispute_column_section_content_facebook_share_title').text(xml.find('leaf[name="dispute_column_section_content_facebook_share_title"]').text());
		$('.dispute_column_section_content_facebook_share_subtitle').text(xml.find('leaf[name="dispute_column_section_content_facebook_share_subtitle"]').text());
		$('#dispute_time_remaining_preview_label').text(xml.find('leaf[name="dispute_time_remaining_preview_label"]').text());
		$('.dispute_private_chat_mediator_label').text(xml.find('leaf[name="dispute_private_chat_mediator_label"]').text());
		$('.dispute_fb_btn_label').text(xml.find('leaf[name="dispute_fb_btn_label"]').text());
		$('.dispute_private_chat_preview_mediator_chat_with_label').text(xml.find('leaf[name="dispute_private_chat_preview_mediator_chat_with_label"]').text());
	}

	function isLabelOnly(targetDiv) { // check if div include a label only or more content
		targetDivHTML = targetDiv.html();

		if(targetDivHTML.indexOf('option_') == -1) {
			targetDiv.addClass('empty');
			return true;
		}
		else {
			targetDiv.removeClass('empty');
			return false;
		} 
	}

	function injectLabels() { // if brainstorm were dragged and div is now empty, check if label needs to be shown again
		var availableOptionsDecideDiv = $('#dispute_column_section_content_parties_selection_drag_here');
		var availableOptionsAgreeDiv = $('#dispute_column_section_content_agreement_drag_here');

		if(isLabelOnly(availableOptionsDecideDiv) || isLabelOnly(availableOptionsAgreeDiv)) {
			global.getLanguage('dispute', function(xml) {
				xml = $(xml);
				if(isLabelOnly(availableOptionsDecideDiv)) {
					availableOptionsDecideDiv.addClass('empty');
					availableOptionsDecideDiv.text(xml.find('leaf[name="dispute_column_section_content_parties_selection_drag_here"]').text());
				}
				else if(isLabelOnly(availableOptionsAgreeDiv)) {
					availableOptionsAgreeDiv.addClass('empty');
					availableOptionsAgreeDiv.text(xml.find('leaf[name="dispute_column_section_content_agreement_drag_here"]').text());
				}
			});
		}
	}

	function openPopUp(event) {
		$('.dispute_popup_container').show();
		$('.dispute_container').addClass('dispute_blur')
	}

	function closePopUp(event) {
		$('.dispute_popup_container').hide();
		$('.dispute_container').removeClass('dispute_blur')
	}

	function inspectChars(maxChars, input) {
		var totalChars = $('.' + input).val().length;
		$('.dispute_column_section_content_chat_new_message_bottom_chars_count').html(maxChars - totalChars);
		$('.' + input + '_chars_count').html(maxChars - totalChars);
	}

	function getTimeRemaining(endTime) {
		var offset = new Date().getTimezoneOffset();
		offsetMilisecs = offset * 60000;

		var time = Date.parse(endTime) - Date.parse(new Date()) - offsetMilisecs;
		var seconds = Math.floor((time/1000) % 60);
		var secondsInitial = seconds % 10;
		var secondsSecond = Math.floor(seconds / 10);
		var minutes = Math.floor((time/1000/60) % 60);
		var minutesInitial = minutes % 10;
		var minutesSecond = Math.floor(minutes / 10);
		var hours = Math.floor((time/(1000*60*60)));
		var hoursInitial = hours % 10;
		var hoursSecond = Math.floor(hours / 10);
		var days = Math.floor(time/(1000*60*60*24));
		return {
			'total': time,
			'days': days,
			'hours': hours,
			'hoursInitial': hoursInitial,
			'hoursSecond': hoursSecond,
			'minutes': minutes,
			'minutesInitial': minutesInitial,
			'minutesSecond': minutesSecond,
			'seconds': seconds,
			'secondsInitial': secondsInitial,
			'secondsSecond': secondsSecond
		};
	}

	function initializeTimer(endTime) {
		global.getLanguage('dispute', function(xml) {
			xml = $(xml);
			var days = xml.find('leaf[name="dispute_time_days"]').text();
			var hours = xml.find('leaf[name="dispute_time_hours"]').text();
			var minutes = xml.find('leaf[name="dispute_time_minutes"]').text();		
			var seconds = xml.find('leaf[name="dispute_time_seconds"]').text();
			var done = xml.find('leaf[name="dispute_time_done"]').text();

			var timeLeftDiv = $('#dispute_time_left_timer');
			var timeinterval = setInterval(function() {
				var timeLeft = getTimeRemaining(endTime);

				if(timeLeft.total <= 0) {
					clearInterval(timeinterval);
					timeLeft.secondsInitial = 0;
					timeLeft.secondsSecond = 0;
					timeLeft.minutesInitial = 0;
					timeLeft.minutesSecond = 0;
					timeLeft.hoursInitial = 0;
					timeLeft.hoursSecond = 0;
				}

				timeLeftDiv.html(timeLeft.days + ' ' + ' ' + days + ' ' + timeLeft.hours + ' ' + ' ' + hours + ' ' + timeLeft.minutes + ' ' + minutes + ' ' + timeLeft.seconds + ' ' + seconds);
				var HTML = '';
				HTML += '<span class="dispute_counter">' + timeLeft.secondsInitial + '</span>'
					  + '<span class="dispute_counter">' + timeLeft.secondsSecond + '</span>'
					  + '<img src="www/images/dispute/dispute_timer_dots.png">'
					  + '<span class="dispute_counter">' + timeLeft.minutesInitial + '</span>'
					  + '<span class="dispute_counter">' + timeLeft.minutesSecond + '</span>'
					  + '<img src="www/images/dispute/dispute_timer_dots.png">'
				 	  + '<span class="dispute_counter">' + timeLeft.hoursInitial + '</span>'
					  + '<span class="dispute_counter">' + timeLeft.hoursSecond + '</span>';
				timeLeftDiv.html(HTML);
			}, 1000);
		});
	}

	/* Mediator Menu */
	function toggleMediatorMenu() {
		$('.dispute_mediator_menu_btn').toggleClass('open');
		$('.dispute_mediator_menu').toggleClass('open');
		$('.dispute_mediator_menu_label').toggle();
		$('.dispute_mediator_menu_main').toggle();
		$('.dispute_private_chat_container').toggle();
		if($('.dispute_mediator_menu_main_item_open:visible').length) {
			closeMediatorMenuItems();
		}
	}

	function openMediatorMenuItem() {
		var itemId = $(this).attr('id');
		var menuItem = itemId + '_open';
		$('#' + menuItem).show();
		$('#' + itemId).addClass('active');
		$('.dispute_mediator_menu_main_item.active').click(closeMediatorMenuItems);

		if(menuItem == 'dispute_mediator_menu_main_item_address_crowd_open') {
			if($.disoute_detials[0].blockStatus) {
				addressCrowdGoToStage2();
				addressCrowdGoToStage3();
			}
		}
	}

	function closeMediatorMenuItems() {
		var itemId = $(this).attr('id');
		$('#' + itemId).removeClass('active');
		$('.dispute_mediator_menu_main_item_open').hide();
		$('.dispute_mediator_menu_main_item').click(openMediatorMenuItem);
		$('.dispute_mediator_menu_main_item').removeClass('active');
	}

	function publishMediatorNotes() {
		var data = {};
		data.id_dispute = $.disoute_detials[0].id;
		data.mediator_note1 = encodeURIComponent($('#dispute_mediator_menu_main_item_open_notes_textarea_side1').val());
		data.mediator_note2 = encodeURIComponent($('#dispute_mediator_menu_main_item_open_notes_textarea_side2').val());

		var url = '/api/mentor/updateNote/';

		global.api(url, data, function(data) {
			closeMediatorMenuItems();
		});

	}

	function toggleMediatorMenuItemAddressCrowdSelection() {
		$('.dispute_mediator_menu_main_item_address_crowd_open_part_choices_container div').removeClass('dispute_mediator_menu_selected');
		var classToToggle = $(this).attr('class');
		$('.' + classToToggle).toggleClass('dispute_mediator_menu_selected');
	}

	function toggleMediatorMenuItemAddressCrowdSelectionEdit() {
		var mainTag = $.trim($('.dispute_mediator_menu_selected').find('span').html());
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').removeClass('edit');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').val(mainTag);
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag_edit').hide();
	}

	function focusOnTagInput() {
		$(this).hide();
		$(this).parent().find('input').focus();
	}

	function showTagPlaceholder() {
		if($(this).val() == '') {
			$(this).parent().find('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').show();
		}
	}

	function hideTagPlaceholder() {
		$(this).parent().find('.dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag_placeholder').hide();
	}

	function addressCrowdGoToStage2() {
		$('#dispute_mediator_menu_main_item_address_crowd_open').hide();
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2').show();
	}

	function addressCrowdGoToStage3() {

		$('#dispute_mediator_menu_main_item_address_crowd_open_stage2').hide();
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3').show();
		var mediatorText = $('#dispute_mediator_menu_main_item_address_crowd_open_part_textarea_number_1').val();
		var mainTag = $.trim($('.dispute_mediator_menu_selected').find('span').html());
		var tag1 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag1').val();
		var tag2 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag2').val();
		var tag3 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag3').val();
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').val(mainTag);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_part_tags_tag1').val(tag1);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_part_tags_tag2').val(tag2);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_part_tags_tag3').val(tag3);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_mediator').val(decodeURIComponent(mediatorText));

		var url = '/api/dispute/changeFirstAgree/';
		var data = {
			mediator_textProblem: mediatorText,
			tag1: mainTag,
			tag2: tag1,
			tag3: tag2,
			tag4: tag3,
			dispute_id: $.disoute_detials[0].id
		};

		global.api(url, data, function(data) {
		});		
	}

	function addressCrowdStage3AllowEdit() {
		$('.dispute_mediator_menu_edit').show();
		$('.dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea textarea').css('pointer-events', 'auto');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3 .dispute_mediator_menu_main_item_address_crowd_open_part_tags_container input').css('pointer-events', 'auto');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').addClass('active');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').click(toggleMediatorMenuEditMainTag);
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').html('סיים עריכה');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').unbind('click');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').click(addressCrowdStage3DisallowEdit);
		$('#dispute_mediator_menu_main_item_address_crowd_open_btn_edit').hide();
	}

	function addressCrowdStage3DisallowEdit() {
		/*zloof*/
		$('.dispute_mediator_menu_edit').hide();
		$('.dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea textarea').css('pointer-events', 'none');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3 .dispute_mediator_menu_main_item_address_crowd_open_part_tags_container input').css('pointer-events', 'none');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').removeClass('active');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag').unbind('click');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').html('פרסם');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').unbind('click');
		$('#dispute_mediator_menu_main_item_address_crowd_open_stage3_btn').click(addressCrowdStage3Publish);
		$('#dispute_mediator_menu_main_item_address_crowd_open_btn_edit').show();
		//addressCrowdGoToStageEdit3()
	}

	function toggleMediatorMenuEditMainTag() {
		$(this).addClass('edit');
		$('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_main_tag_edit').toggle();
	}

	function addressCrowdStage3Publish() {
		var data = {};
		data.id_dispute = $.disoute_detials[0].id;
		data.mediator_textProblem = $('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_mediator').val();
		data.parties1_textProblem = $('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_side1').val();
		data.parties2_textProblem = $('#dispute_mediator_menu_main_item_address_crowd_open_stage3_textarea_side2').val();
		data.tag1 = parseMainTag($('.dispute_mediator_menu_selected'));
		data.tag2 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag1').val();
		data.tag3 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag2').val();
		data.tag4 = $('#dispute_mediator_menu_main_item_address_crowd_open_part_tags_tag3').val();

		var url = '/api/mentor/firstEdit/';

		global.api(url, data, function(data) {
			closeMediatorMenuItems();
			$('#dispute_mediator_menu_main_item_address_crowd').unbind('click');
		});
	}

	function parseMainTag(tag) {
		var tagClass = tag.attr('class');
        if(tagClass==undefined){
            return 1;
        }
		else if(tagClass.indexOf('relations') != -1) {
			return 1;
		}
		else if(tagClass.indexOf('commercial') != -1) {
			return 2;
		}
		else if(tagClass.indexOf('virtual') != -1) {
			return 3;
		}
		else {
			return 4;
		}
	}

	function parseMainTagToString(tagNumber) {
		var tagString = '';
		switch(tagNumber) {
			case 1:
				tagString = 'relations';
			break;
			case 2:
				tagString = 'commercial';
			break;
			case 3:
				tagString = 'virtual';
			break;
			case 4: 
				tagString = 'accomodation';
			break;
		}

		return tagString;
	}

	function bindSlider(sliderId) {
		var now = new Date();
		var endDate = new Date();
		endDate.setHours(endDate.getHours() + 24);

		var datePreview = $('#dispute_time_remaining_slider_preview .dispute_time_remaining_slider_preview_date');
		var timePreview = $('#dispute_time_remaining_slider_preview .dispute_time_remaining_slider_preview_time');
		datePreview.html(endDate.getDate() + '/' + Number(endDate.getMonth() + 1) + '/' + endDate.getYear());
		timePreview.html(endDate.getHours() + ':' + endDate.getMinutes());
		$('#dispute_time_remaining_slider_value').val(endDate);

		var sliderInput = $(sliderId).find('input');
		var sliderLabel = $('#dispute_time_remaining_hours');
		sliderInput.on('input', function() {
			endDate = new Date();
			var value = sliderInput.val();
			value *= 1;
			sliderLabel.html(value);
			endDate.setHours(endDate.getHours() + value);
			datePreview.html(endDate.getDate() + '/' + Number(endDate.getMonth() + 1) + '/' + endDate.getYear());
			timePreview.html(endDate.getHours() + ':' + endDate.getMinutes());
			$('#dispute_time_remaining_slider_value').val(endDate);
		});
	}

	function setDisputeEndTime() {
		var endDate = new Date($('#dispute_time_remaining_slider_value').val());
		var offset = new Date().getTimezoneOffset();
		var GMTdate = new Date(endDate.valueOf()).toISOString().slice(0, 19).replace('T', ' ');

		var data = {};
		data.id_dispute = $.disoute_detials[0].id;
		data.time = GMTdate;		

		var url = '/api/mentor/updateTime/';

		global.api(url, data, function(data) {
			closeMediatorMenuItems();
		});
	}

} 