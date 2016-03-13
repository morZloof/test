var notebookNav = new notebookNavJs()
function notebookNavJs(){
	function ctor(){
		showPage();
        $('.notebookNav_map').click(showMap);
        $('.notebookNav_notebook').click(showNoteBook);
        $('.notebookNav_war').click(showWar);
	}
	this.ctor = ctor;

	function showPage(){
        var mainBuildingLevel = buildingsJson.getMainBuilding().level;

        if(buildingsJson.counterBuildings(3)>0){
            $(".notebookNav_war").show()
        }
        else{
            $(".notebookNav_war").hide()
        }
        
        if($.globalUser!= undefined && $.globalUser.mentor<13){
            $(".notebookNav").css("left","403px")
        }
        else{
            $(".notebookNav").css("left","329px")
        }
        
        $(".global_page_notebookNav").show()
	}
	this.showPage = showPage;
    
	function showMap(){
        setActive(this);
		$(".global_page_war").hide()
        vmap.closeFlow();		
		vmap.showPage()
	}
    this.showMap = showMap;
	function showNoteBook(){
        setActive(this);
		$(".global_page_war").hide()		
		notebook.showPage()
	}
    function showWar() {
        setActive(this);
        war.showPage();
        
    }
    function setActive(e){
        $('.notebookNav').find('div').removeClass( "notebookNav_active");
        $(e).addClass("notebookNav_active");

    }
}
