var help = new helpJs()
function helpJs(){
	function ctor(){
		
	}
	
	function addComma(x){
        if(x==null){
            return 0;
        }
        
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		return parts.join(".");
	}
	this.addComma = addComma;

	function orderStreetName(str){
		if(str.indexOf('Street')>0){
			return (str.replace('Street',''));
		}
		else{
			return str;
		}
	}
	this.orderStreetName = orderStreetName;
}