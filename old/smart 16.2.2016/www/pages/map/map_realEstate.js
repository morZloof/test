var map_realEstate = new map_realEstateJs()

function map_realEstateJs(){
	function ctor(){
		
	}
	this.ctor = ctor;

	function startFlow(){
		vmap.makeMapLarger();
        showNote();
        getCitiesNames();
	}
    this.startFlow = startFlow;
    	
	function showNote() {
		addBuilding.hideBuildings()
		$('.map_note_realEstate').show();
		$('.map_note_cancel').click(vmap.closeFlow);
        $(".map_note_cancel").show()

	}
	this.showNote = showNote;
	
    function getCitiesNames() {
        // TODO: 
        //1. GET FROM API CITIES NAMES
        var citiesJson = getCites();
        //2. SET THE SLIDER 
        setSlider(citiesJson);
    }
    
    function getCites() {
        //GET FROM API CITIES NAMES
        return 'חיפה';
    }
    
    function setSlider(citiesJson) {
        // SET THE SLIDER 
        $('.map_note_slider_cityName').text(citiesJson);
        
        //3.EVERY CITIY ZOOM TO MAIN 
        zoomToCity();
    }
    
    function zoomToCity() {
       //EVERY CITIY ZOOM TO MAIN 
    }

}
