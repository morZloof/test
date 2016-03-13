var pages = new pagesJS()
function pagesJS (){
		
	function checkPage(){
		var url = window.location.hash;
		var url = url.split("#").pop()
		pages(url);
	}
	this.checkPage = checkPage;
	
	$(window).on('hashchange', function() {
		var url = window.location.hash;
		var url = url.split("#")[1];
		
		if(url == undefined){
			url = "";
		}
		pages(url)
	});
	
	function pages(vpage){

		if(vpage.indexOf('?')>0){
			vpage = vpage.split("?")[0];
		}
		if(vpage=="dispute"){
			dispute.showPage()
		}
        else if(vpage=="mUsers"){
            mUsers.showPage()
        }
		else if(vpage=="allDispute"){
			allDisputes.showPage()
		}
		else if(vpage=="feedback"){
			feedback.showPage();
		}
		else if(vpage=="initDispute"){
			initDispute.showPage()
		}
		else if(vpage=="notifications"){
			notifications.showPage()
		}
		else if(vpage=="mentor"){
			mentor.showPage()
		}
        else if(vpage=="mentorUsers"){
			mentor.showPage();
            mentor.showUsers();
        }
        else if(vpage=="mDispute"){
            mDispute.showPage();
        }
		else if(vpage=='faq'){
			faq.showPage();
		}
		else if(vpage=='main' || vpage.indexOf('register')>=0){
			vmain.showPage();
		}
		else if(vpage=='login'){
			login.showPage();
		}
		else if(vpage=='work'){
			work.showPage();
		}
		else{
			allDisputes.showPage()
		}
	}
	this.pages = pages;
}