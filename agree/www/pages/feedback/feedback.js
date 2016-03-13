var feedback = new feedbackJs()
function feedbackJs(){
	function ctor(){
		$('.feedback_category .feedback_category_rank').click(feedbackRank);
		$('.feedkback_send_btn').click(feedbackSend);
		getLanguage();
	}
	this.ctor = ctor;

	function showPage(){
		global.globalHide();
		$(".global_page_feedback").show();
	}
	this.showPage = showPage;

	function feedbackRank(event) {
		var questionId = $(event.target).parent().parent().attr('id');
		var value = event.currentTarget.innerHTML;

		$('#' + questionId + ' .feedback_category_rank').removeClass('selected');
		$(event.target).addClass('selected');
	}

	function isAllQuestionsFilled(data) {
		console.log(data);
		if(!data.question1Answer || !data.question2Answer || !data.question3Answer || !data.question4Answer || !data.question5Answer) {
			return false;
		}
		else {
			return true;
		}
	}

	function feedbackSend() {
		var data = {
			question1Answer: '',
			question2Answer: '',
			question3Answer: '',
			question4Answer: '',
			question5Answer: '',
		};

		data.question1Answer = $('#feedback_category_1 .selected').html();
		data.question2Answer = $('#feedback_category_2 .selected').html();
		data.question3Answer = $('#feedback_category_3 .selected').html();
		data.question4Answer = encodeURIComponent($('#feedback_category_4 .feedback_textarea').val());
		data.question5Answer = encodeURIComponent($('#feedback_category_5 .feedback_textarea').val());

		if(!isAllQuestionsFilled(data)) {
			alert('please complete all questions');
		}

		/* Call api
		var url = '/api/feedback/addFeedback/';
		global.api(url, data, function() {
			if(data == 'success') {
				alert('thank you for your feedback');
			}
		});
		*/
	}

	function getLanguage() {
		global.getLanguage('feedback', function(xml) {
			xml = $(xml);
			echoLanguage(xml);
		})
	}

	function echoLanguage(xml) {
		$(".feedback_header_title").text(xml.find('leaf[name="feedback_header_title"]').text());
		$(".feedback_header_subtitle").text(xml.find('leaf[name="feedback_header_subtitle"]').text());
		$("#feedback_category_1 .feedback_category_question").text(xml.find('leaf[name="feedback_category_question_1"]').text());
		$("#feedback_category_2 .feedback_category_question").text(xml.find('leaf[name="feedback_category_question_2"]').text());
		$("#feedback_category_3 .feedback_category_question").text(xml.find('leaf[name="feedback_category_question_3"]').text());
		$("#feedback_category_4 .feedback_category_question").text(xml.find('leaf[name="feedback_category_question_4"]').text());
		$("#feedback_category_5 .feedback_category_question").text(xml.find('leaf[name="feedback_category_question_5"]').text());
		$(".feedback_textarea").attr('placeholder', xml.find('leaf[name="feedback_textarea_start_writing_here"]').text());
		$(".feedback_category_ranking_labels_terrible").text(xml.find('leaf[name="feedback_category_ranking_labels_terrible"]').text());
		$(".feedback_category_ranking_labels_great").text(xml.find('leaf[name="feedback_category_ranking_labels_great"]').text());
		$(".feedback_category_ranking_labels_low").text(xml.find('leaf[name="feedback_category_ranking_labels_low"]').text());
		$(".feedback_category_ranking_labels_high").text(xml.find('leaf[name="feedback_category_ranking_labels_high"]').text());
		$(".feedback_category_ranking_labels_not_at_all").text(xml.find('leaf[name="feedback_category_ranking_labels_not_at_all"]').text());
		$(".feedback_category_ranking_labels_very_mcuh").text(xml.find('leaf[name="feedback_category_ranking_labels_very_mcuh"]').text());
		$(".feedkback_send_btn").text(xml.find('leaf[name="feedback_send"]').text());
	}
}