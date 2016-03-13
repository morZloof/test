$(function(){

	ctor();

	function ctor(){
		load_header();
		load_login();
		load_main();
		load_dispute();
		load_feedback();
		load_all_disputes();
		global_page_mentor();
		load_init_dispute();
		load_notifications();
		load_faq();
		load_work();
        load_mDispute();
        load_mUsers();
	}

    function load_mUsers(){
        $(".global_page_mUsers").load("www/pages/mUsers/mUsers.html", function() {
			mUsers.ctor();
		});
    }
	function global_page_mentor(){
		$(".global_page_mentor").load("www/pages/mentor/mentor.html", function() {
			mentor.ctor();
		});
	}
    
    function load_mDispute(){
        $(".global_page_mDispute").load("www/pages/mDispute/mDispute.html", function() {
			mDispute.ctor();
		});
    }
	function load_dispute(){
		$(".global_page_dispute").load("www/pages/dispute/dispute.html", function() {
			dispute.ctor();
		});
	}
	function load_feedback(){
		$(".global_page_feedback").load("www/pages/feedback/feedback.html", function() {
			feedback.ctor();
		});
	}

	function load_faq(){
		$(".global_page_faq").load("www/pages/faq/faq.html", function() {
			faq.ctor();
		});
	}

	function load_work(){
		$(".global_page_work").load("www/pages/work/work.html", function() {
			work.ctor();
		});
	}

	function load_all_disputes(){
		$(".global_page_all_disputes").load("www/pages/alldisputes/alldisputes.html", function() {
			allDisputes.ctor();
		});
	}

	function load_init_dispute(){
		$(".global_page_init_dispute").load("www/pages/initdispute/initdispute.html", function() {
			initDispute.ctor();
		});
	}

	function load_main(){
		$(".global_page_main").load("www/pages/main/main.html", function() {
			vmain.ctor();
		});
	}

	function load_notifications(){
		$(".global_page_notifications").load("www/pages/notifications/notifications.html", function() {
			notifications.ctor();
		});
	}

	function load_header(){

		$(".global_page_header").load("www/header/header.html", function() {

			header.ctor();

		});	

	}

	function load_login(){

		$(".global_page_login").load("www/pages/login/login.html", function() {

			global.main();

			login.ctor();

		});	

	}

})