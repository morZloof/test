var payment = new paymentJs();
function paymentJs(){
	function ctor(){
		setSessionForPayments()
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide();
		$(".global_page_payment").show();
	}
	this.showPage = showPage;	
	
	function setSessionForPayments() {
		var session = $.cookie('session');
		$('.payment_userToken').attr('value', session);
		console.log(session)
		
	}
}