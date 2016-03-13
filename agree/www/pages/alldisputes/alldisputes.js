var allDisputes = new allDisputesJs()
function allDisputesJs() {
	function ctor() {
		$('.all_disputes_body_sort_by_btn').click(toggleSortTooltip);
		$('.all_disputes_body_sort_by_tooltip_sort_methods li span').click(sortDisputes);
		$(".all_disputes_popup_close, .all_disputes_popup_close_btn").click(closePopUp);
		$('.all_disputes_body_view_by_options_option').click(filterDisputesByTag);
        
		// $('.all_disputes_body_view_by_subtitle').click(openPopUp);
        $(".all_disputes_popup_my_area_btn").click(showProfile);
        
	}
	this.ctor = ctor;

	function showPage() {
		$('.header_link').removeClass('active')
		$(".header_dispute_platform").addClass('active')

		getDisputes();
		global.globalHide();
		$(".global_page_all_disputes").show();
		$('.header_dispute_platform').html('<a href="#">סכסוכים</a>');
	}
	this.showPage = showPage;

    function showProfile(){
        closePopUp();
        header.toggleProfile();
    }
	function showPageWithLoginPage() {
		getDisputes();

		// global.globalHide();
		$(".global_page_all_disputes").show();
		$('.header_dispute_platform').html('<a href="#">סכסוכים</a>');
	}
	this.showPageWithLoginPage = showPageWithLoginPage;

    var firstTime = 1;	
	function getDisputes() {
        if(firstTime==1){
            firstTime=0;
            var data = {};
            var url = '/api/allDispute/getAllDispute';

            global.api(url, data, function(data) {
                showDisputes(JSON.parse(data));
                $('.all_disputes_body_disputes_dispute_title').mouseenter(toggleDisputeTooltipTitle).mouseleave(toggleDisputeTooltipTitle);
                $('.all_disputes_body_disputes_dispute_info_side1').mouseenter(toggleDisputeTooltipSide).mouseleave(toggleDisputeTooltipSide);
                $('.all_disputes_body_disputes_dispute_info_side2').mouseenter(toggleDisputeTooltipSide).mouseleave(toggleDisputeTooltipSide);
            });
        }
	}

	function showDisputes(disputes, isFavsFirst) {
		var currentDisputeHTML = '';
		var allDisputesDiv = $('#all_disputes_container');
		allDisputesDiv.html('');
		if(isFavsFirst) {
			var disputesFavs = disputes[0];
			var disputesOthers = disputes[1];

			for(var i = 0; i < disputesFavs.length; i++) {
				currentDisputeHTML = disputePreviewCreator(disputesFavs[i]);
				allDisputesDiv.append(currentDisputeHTML);
			}

			for(var i = 0; i < disputesOthers.length; i++) {
				currentDisputeHTML = disputePreviewCreator(disputesOthers[i]);
				allDisputesDiv.append(currentDisputeHTML);
			}

		}
		else {
			for(var i = 0; i < disputes.length; i++) {
				if(i < 5) {
					isNew = true;
				}
				else {
					isNew = false;
				}
				currentDisputeHTML = disputePreviewCreator(disputes[i], isNew);
				allDisputesDiv.append(currentDisputeHTML);
			}
		}

		bindFeelingsHover();
		bindFavoritesClick();
		getShowFavorites();
		getLanguage();
	}

	function openPopUp(upLevel) {
        if(upLevel==1){
            $(".all_disputes_youve_reached_new_achivment").text("כל הכבוד!")
            $(".all_disputes_new_points").text("צברת "+ $.globalUser.points + " נקודות וקיבלת פטיש שופטים")
            $(".all_disputes_wig_on_profile").text("העיטור מופיע באזור האישי")
            $(".all_disputes_popup_img img").attr('src','/www/images/header/level1.png')
        }
        else if(upLevel==2){
            $(".all_disputes_youve_reached_new_achivment").text("התקדמת!")
            $(".all_disputes_new_points").text("צברת "+ $.globalUser.points + " נקודות וקיבלת מאזני צדק")
            $(".all_disputes_wig_on_profile").text("העיטור מופיע באזור האישי")
            $(".all_disputes_popup_img img").attr('src','/www/images/header/level2.png')
        }
        else if(upLevel==3){
            $(".all_disputes_youve_reached_new_achivment").text("וואו הגעת לשיא!")
            $(".all_disputes_new_points").text("צברת "+ $.globalUser.points + " נקודות וקיבלת פאת שופטים")
            $(".all_disputes_wig_on_profile").text("העיטור מופיע באזור האישי")
            $(".all_disputes_popup_img img").attr('src','/www/images/header/level3.png')
        }
        
		$('.all_disputes_popup_container').show();
		$('.all_disputes_container').addClass('all_disputes_blur')
	}
    this.openPopUp = openPopUp;
    
	function closePopUp(event) {
		$('.all_disputes_popup_container').hide();
		$('.all_disputes_container').removeClass('all_disputes_blur')
	}
	
	function disputePreviewCreator(dispute, isNew) {
		if(isNew) {
			isNew = 'all_disputes_new';
		}
		else {
			isNew = '';
		}

		var HTML = '';

		console.log(dispute);

		dispute.tag1Parsed = parseMainTag(dispute.tag1);
		dispute.tag2 = decodeURIComponent(dispute.tag2);
		dispute.tag3 = decodeURIComponent(dispute.tag3);
		dispute.tag4 = decodeURIComponent(dispute.tag4);
        
		HTML += '<div data-main-tag="' + dispute.tag1 + '" class="' + isNew + ' all_disputes_body_disputes_dispute level' + dispute.feeling + '" id="all_disputes_body_disputes_dispute_' + dispute.id +'">'
			+		'<div class="all_disputes_body_disputes_dispute_right">'
			+			'<div class="all_disputes_body_disputes_dispute_title_container">'
			+				'<div class="all_disputes_body_disputes_dispute_title">' + decodeURIComponent(dispute.title) + ' </div> '
			+				'<div class="all_disputes_body_dispute_tooltip">' + decodeURIComponent(dispute.mediator_textProblem) + '</div>'
			+				'<div class="all_disputes_body_disputes_dispute_level">'
			+					'<img src="../www/images/all_disputes/level' + dispute.vstatus + '.png">'
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_goto">'
			+					'<a href="#dispute?disputeId=' + dispute.id + '">'
			+						'<span class="' + parseGoToLabel(dispute.blockVotesBrain) + '"></span>'
			+					'</a>'
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_mediator">'
			+					'<span class="all_disputes_body_disputes_dispute_mediator_label"></span> Agree Online'
			+				'</div>'
			+			'</div>'
			+			'<div class="all_disputes_body_disputes_dispute_info_container">'
			+				'<div class="all_disputes_body_disputes_dispute_info_side1">'
			+					'<span class="all_disputes_body_disputes_dispute_info_side1_name">'
			+						decodeURIComponent(dispute.parties1_name)
			+					'</span> '
			+					'<span class="all_disputes_feels">'
			+					'</span> '
			+					'<span class="all_disputes_feeling all_disputes_feeling_' + parseNumberToFeeling(dispute.parties1_feel) + '"></span>'
			+					'<div class="all_disputes_body_dispute_tooltip">' + decodeURIComponent(dispute.parties1_textProblem) + '</div>'
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_info_side2">'
			+					'<span class="all_disputes_body_disputes_dispute_info_side2_name">'
			+						decodeURIComponent(dispute.parties2_name)
			+					'</span> '
			+					'<span class="all_disputes_feels">'
			+					'</span> '
			+					'<span class="all_disputes_feeling all_disputes_feeling_' + parseNumberToFeeling(dispute.parties2_feel) + '"></span>'
			+					'<div class="all_disputes_body_dispute_tooltip">' + decodeURIComponent(dispute.parties2_textProblem) + '</div>'
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_info_brainstorms">'
			+					'<span class="all_disputes_body_disputes_dispute_info_brainstorms_total">' + dispute.brainstorms + '</span> '
			+					'<span class="all_disputes_brainstorms"></span> '
			+					'<img src="../www/images/all_disputes/all_disputes_votes.png"> '
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_info_votes">'
			+					'<span class="all_disputes_body_disputes_dispute_info_brainstorms_total">' + dispute.votes + '</span> '
			+					'<span class="all_disputes_votes"></span> '
			+					'<img src="../www/images/all_disputes/all_disputes_brainstorms.png"> '
			+				'</div>'
			+			'</div>'
			+		'</div>'
			+		'<div class="all_disputes_body_disputes_dispute_left">'
			+			'<span class="all_disputes_favorite"></span>'
			+			'<div class="all_disputes_body_disputes_dispute_tags_container">'
			+				'<div class="all_disputes_body_disputes_dispute_tags_tag_icon">'
			+					'<img src="../www/images/all_disputes/all_disputes_tag.png">'
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_tags_tag active">'
			+					checkIfEmpty(dispute.tag1Parsed)
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_tags_tag">'
			+					checkIfEmpty(dispute.tag2)
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_tags_tag">'
			+					checkIfEmpty(dispute.tag3)
			+				'</div>'
			+				'<div class="all_disputes_body_disputes_dispute_tags_tag">'
			+					checkIfEmpty(dispute.tag4)
			+				'</div>'
			+			'</div>'
			+		'</div>'
			+	'</div>';

		return HTML;
	}
	
	function getShowFavorites() {
		var data = {};
		var url = '/api/allDispute/getFav/';
        //
		global.api(url, data, function(data) {
			var allDisputesFavs = JSON.parse(data);
			console.log(allDisputesFavs);
        
			for(var i = 0; i < allDisputesFavs.length; i++) {
				$('#all_disputes_body_disputes_dispute_' + allDisputesFavs[i].dispute_id + ' .all_disputes_favorite').addClass('active');
			}
		});
	}

	function bindFeelingsHover() {
		$('.all_disputes_feeling').mouseenter(function() {
			var backgroundImage = $(this).css('background-image');
			var hoverBackgroundImage = backgroundImage.substring(0, backgroundImage.length - 5);
			hoverBackgroundImage += '_hover.png)';
			$(this).css('background-image', hoverBackgroundImage);
		}).mouseleave(function() {
			var hoverBackgroundImage = $(this).css('background-image');
			var backgroundImage = hoverBackgroundImage.substring(0, hoverBackgroundImage.length - 11);
			backgroundImage += '.png)';
			$(this).css('background-image', backgroundImage);
		})
	}

	function bindFavoritesClick(event) {
		$('.all_disputes_favorite').click(function(event) {
			var disputeId = $(event.target).parent().parent().attr('id').substring(35);
			var favsBtn = $(this);

			var data = {dispute_id: disputeId};

			if(favsBtn.hasClass('active')) {
				var url = '/api/allDispute/unDoFavorite/';

				favsBtn.removeClass('active'); // Remove this after updating API with unDoFavorite

				global.api(url, data, function(data) {
					favsBtn.removeClass('active');
				});
			}
			else {
				var url = '/api/allDispute/doFavorite/';

				global.api(url, data, function(data) {
					favsBtn.addClass('active')
				});
			}
		})
	}

	function toggleSortTooltip() {
		$('.all_disputes_body_sort_by_tooltip').toggle();
		$('.all_disputes_body_sort_by_btn').toggleClass('active');
		$('.all_disputes_body_sort_by_label').toggleClass('active');
	}
    
	function toggleDisputeTooltipTitle(e) {
		var dispute = $(this).parent();
		$(dispute).find('.all_disputes_body_dispute_tooltip').toggle();
	}

	function toggleDisputeTooltipSide() {
		var dispute = $(this);
		$(dispute).find('.all_disputes_body_dispute_tooltip').toggle();
	}

	function sortDisputes(event) {
		var isFavs = false;
		var clickedMethod = $(this)[0].className;
		$('.all_disputes_body_sort_by_tooltip_sort_methods li').removeClass('active');
		var parentLi = $(event.target).parent().addClass('active');

		var data = {};
		var url = '/api/allDispute/doFavorite/';
		
		var sortBy = clickedMethod.substring(34);

		switch(sortBy) {
			case 'new_first':
				url = '/api/allDispute/getAllDispute/';
				break;
			case 'favs_first':
				url = '/api/allDispute/getAllDisputeFav/';
				isFavs = true;
				break;
			case 'hot_first':
				url = '/api/allDispute/getAllDisputeHot/';
				break;
			case 'total_brainstorms':
				url = '/api/allDispute/getAllDisputeBrainstorm/';
				break;
			case 'total_votes':
				url = '/api/allDispute/getAllDisputeVotes/';
				break;
		}

		toggleSortTooltip();

		global.api(url, data, function(data) {
			showDisputes(JSON.parse(data), isFavs);
            $('.all_disputes_body_disputes_dispute_title').mouseenter(toggleDisputeTooltipTitle).mouseleave(toggleDisputeTooltipTitle);
			$('.all_disputes_body_disputes_dispute_info_side1').mouseenter(toggleDisputeTooltipSide).mouseleave(toggleDisputeTooltipSide);
			$('.all_disputes_body_disputes_dispute_info_side2').mouseenter(toggleDisputeTooltipSide).mouseleave(toggleDisputeTooltipSide);
		});
	}

	function checkIfEmpty(tag) {
		if(tag == '') {
			return '-';
		}
		else return tag;
	}

	function parseGoToLabel(blockVoteBrain) {
		if(blockVoteBrain) {
			return 'all_disputes_body_disputes_dispute_goto_label';
		}
		else {
			return 'all_disputes_body_disputes_dispute_goto_label_help';
		}
	}

	function filterDisputesByTag() {
		if($(this).hasClass('active')) {
			getDisputes();
			$(this).removeClass('active');
		}
		else {
			$('.all_disputes_body_view_by_options_option').removeClass('active');
			$(this).addClass('active');
			var tagToSortBy = $(this).attr('data-main-tag');
			var data = {tag_id: tagToSortBy};

			url = '/api/allDispute/getTag/';

			var isFavs = true;

			global.api(url, data, function(data) {
				showDisputes(JSON.parse(data));
			});
		}
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

	function parseMainTag(tagNumber) {
		var tagString = '';
		switch(tagNumber) {
			case 1:
				tagString = '<span class="alldisputes_relations"></span>';
			break;
			case 2:
				tagString = '<span class="alldisputes_commercial"></span>';
			break;
			case 3:
				tagString = '<span class="alldisputes_virtual"></span>';
			break;
			case 4: 
				tagString = '<span class="alldisputes_accomodation"></span>';
			break;
		}

		return tagString;
	}

	function getLanguage() {
		global.getLanguage('alldisputes', function(xml) {
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