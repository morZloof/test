var map_click = new map_clickJs()
function map_clickJs(){
  var canBuild = 1;
  var loopWorks = 0;
  this.canBuild = canBuild;
  
	function ctor(){
      
	}
	this.ctor = ctor;

  function startChecking(icon) {
      setCurser(icon)
      loopWorks = 1;
		vmap.map.on('zoomend', function() {
             if (loopWorks == 1) {
                $('.map img').unbind('mousemove');
                createCanvas()
                checkingPoints();
                setCurser(icon)
            }
        });
		vmap.map.on('dragend', function() {
             if (loopWorks == 1) {
                $('.map img').unbind('mousemove');
                createCanvas()
                checkingPoints();
                setCurser(icon)
             }
        });
        checkingPoints();
  }
  this.startChecking = startChecking;
  
  function stopChecking() {
    loopWorks = 0;
    vmap.map.off('click');
    $('.map img').unbind('mousemove');
    $("#mapbox").css('cursor','default');
    $('#curser_tail').hide();
  }
  this.stopChecking = stopChecking;
  
  var checkColorsCounter = 0;
  var checkColorsArray = [];
  function mapClickWorking(e,div,callback){
      checkColorsArray = []
      checkColorsCounter = 0;
      var position = findPos(div);
      var x = e.pageX - position.x;
      var y = e.pageY - position.y;
        var offset =  $('#mapbox').offset();
        x = e.pageX
        y = e.pageY
        checkRadius(x,y,div);
        checkIfYouCanBuild(callback)

  }
  this.mapClickWorking = mapClickWorking;

  function checkRadius(x,y,div){
    
    var zoom = vmap.map.getZoom()
    var markerPx = vmap.markerSize(zoom)
    var radius = markerPx/2;

    radius = radius / (20-zoom);
    
    mapCheckAround(x,y,div)
    mapCheckAround(x+radius , y+radius , div)
    mapCheckAround(x-radius , y+radius , div)
    mapCheckAround(x+radius , y-radius , div)
    mapCheckAround(x , y+radius , div)
    mapCheckAround(x+radius , y , div)
    mapCheckAround(x , y-radius , div)
    mapCheckAround(x-radius , y , div)
    mapCheckAround(x-radius , y-radius , div)
    
    mapCheckAround(x+radius/2 , y+radius/2 , div)
    mapCheckAround(x-radius/2 , y+radius/2 , div)
    mapCheckAround(x+radius/2 , y-radius/2 , div)
    mapCheckAround(x , y+radius/2 , div)
    mapCheckAround(x+radius/2 , y , div)
    mapCheckAround(x , y-radius/2 , div)
    mapCheckAround(x-radius/2 , y , div)
    mapCheckAround(x-radius/2 , y-radius/2 , div)

    
     radius = $('#curser_tail').width()/2;

    radius = radius / (20-zoom);
    
    mapCheckAround(x,y,div)
    mapCheckAround(x+radius , y+radius , div)
    mapCheckAround(x-radius , y+radius , div)
    mapCheckAround(x+radius , y-radius , div)
    mapCheckAround(x , y+radius , div)
    mapCheckAround(x+radius , y , div)
    mapCheckAround(x , y-radius , div)
    mapCheckAround(x-radius , y , div)
    mapCheckAround(x-radius , y-radius , div)
    
    mapCheckAround(x+radius/2 , y+radius/2 , div)
    mapCheckAround(x-radius/2 , y+radius/2 , div)
    mapCheckAround(x+radius/2 , y-radius/2 , div)
    mapCheckAround(x , y+radius/2 , div)
    mapCheckAround(x+radius/2 , y , div)
    mapCheckAround(x , y-radius/2 , div)
    mapCheckAround(x-radius/2 , y , div)
    mapCheckAround(x-radius/2 , y-radius/2 , div)
  }
  
  function checkIfYouCanBuild(callback){
    var loopLength = checkColorsArray.length
    // console.log(checkColorsArray)
    
    canBuild = 1;
    for(var i=0; i<loopLength ; i++)
    {
      var color = checkColorsArray[i]
      //if(color == "#000000" || color == "#ffffff" || color == '#73b6e6'){
      if(color == "#ffffff" || color == '#73b6e6'){
        canBuild = 0;
      }
        // console.log(canBuild)
    }
    
    if(canBuild == 1){
      callback(1)
      // console.log("תבנה כפרה")
    }
    else{
      callback(0)
      // console.log("אל תבנה על כבישים!")
    }
  }
  
  function mapCheckAround(x,y,div){
    x = x;
    y = y;
    
    var canvas = $("#map_canvas")[0].getContext('2d');
    var p = canvas.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    
    checkColorsArray[checkColorsCounter] = hex;
    checkColorsCounter++;
    
    // print red color where you click
    if(typeof $.context != 'undefined') {
        // $.context.moveTo(x-1, y-1);
        // $.context.lineTo(x+1, y+1);
        // $.context.strokeStyle = '#ff0000';
        // $.context.stroke();
    }
  }
 
 
  function findPos(obj){
    var current_left = 0, current_top = 0;
    if (obj.offsetParent){
    do{
      current_left += obj.offsetLeft;
      current_top += obj.offsetTop;
    }while(obj = obj.offsetParent);
    return {x: current_left, y: current_top};
    }
    return undefined;
  }
  
  function rgbToHex(r, g, b){
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }
  
  
  
  function createCanvas() {
    var tilesLength = $('#mapbox').find('.leaflet-tile-loaded').length;
    var canvas = document.getElementById('map_canvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i=0; i<tilesLength; i++) {
        var img = new Image();
        var tileLeft = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().left - $(window).scrollLeft();
        var tileTop = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().top - $(window).scrollTop();
        var canvas = document.getElementById('map_canvas');
        var context = canvas.getContext('2d');
        $.context = context
        img.crossOrigin = 'anonymous';
        img.src = $('#mapbox').find('.leaflet-tile-loaded').eq(i).attr("src");
        img.setAtX = tileLeft;
        img.setAtY = tileTop;
        img.onload = function() {
            context.drawImage(this, this.setAtX, this.setAtY);
        };
    }
    
    setTimeout(function(){
        var tilesLength = $('#mapbox').find('.leaflet-tile-loaded').length;
            var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
        for (var i=0; i<tilesLength; i++) {
            var img = new Image();
            var tileLeft = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().left - $(window).scrollLeft();
            var tileTop = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().top - $(window).scrollTop();
           var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            $.context = context
            img.crossOrigin = 'anonymous';
            img.src = $('#mapbox').find('.leaflet-tile-loaded').eq(i).attr("src");
            img.setAtX = tileLeft;
            img.setAtY = tileTop;
            img.onload = function() {
                context.drawImage(this, this.setAtX, this.setAtY);
            };
        }
    },1000) 
    setTimeout(function(){
        var tilesLength = $('#mapbox').find('.leaflet-tile-loaded').length;
            var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
        for (var i=0; i<tilesLength; i++) {
            var img = new Image();
            var tileLeft = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().left - $(window).scrollLeft();
            var tileTop = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().top - $(window).scrollTop();
           var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            $.context = context
            img.crossOrigin = 'anonymous';
            img.src = $('#mapbox').find('.leaflet-tile-loaded').eq(i).attr("src");
            img.setAtX = tileLeft;
            img.setAtY = tileTop;
            img.onload = function() {
                context.drawImage(this, this.setAtX, this.setAtY);
            };
        }
    },2000)
    setTimeout(function(){
        var tilesLength = $('#mapbox').find('.leaflet-tile-loaded').length;
            var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
        for (var i=0; i<tilesLength; i++) {
            var img = new Image();
            var tileLeft = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().left - $(window).scrollLeft();
            var tileTop = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().top - $(window).scrollTop();
           var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            $.context = context
            img.crossOrigin = 'anonymous';
            img.src = $('#mapbox').find('.leaflet-tile-loaded').eq(i).attr("src");
            img.setAtX = tileLeft;
            img.setAtY = tileTop;
            img.onload = function() {
                context.drawImage(this, this.setAtX, this.setAtY);
            };
        }
    },3000)
    setTimeout(function(){
        var tilesLength = $('#mapbox').find('.leaflet-tile-loaded').length;
            var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            
        for (var i=0; i<tilesLength; i++) {
            var img = new Image();
            var tileLeft = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().left - $(window).scrollLeft();
            var tileTop = $('#mapbox').find('.leaflet-tile-loaded').eq(i).offset().top - $(window).scrollTop();
           var canvas = document.getElementById('map_canvas');
            var context = canvas.getContext('2d');
            $.context = context
            img.crossOrigin = 'anonymous';
            img.src = $('#mapbox').find('.leaflet-tile-loaded').eq(i).attr("src");
            img.setAtX = tileLeft;
            img.setAtY = tileTop;
            img.onload = function() {
                context.drawImage(this, this.setAtX, this.setAtY);
            };
        }
    },4000)
  }
  this.createCanvas = createCanvas;
  function setCurser(icon) {
    var zoomLevel = vmap.map.getZoom();
    var markerPx = vmap.markerSize(zoomLevel)

    $(document).bind('mousemove', function(e){
        $('#curser_tail').css({
            'width' :markerPx,
            'height' :markerPx,
           'background-image': 'url("'+icon+'")',
            'background-size': markerPx,
            'background-repeat':'none',
            // THIS NEEDS TO BE CHANGED IN ZOOM
            left:  e.pageX - 30,
            top:   e.pageY - 30
        });
        
        $('#curser_tail_noEntrence').css({
            'width' :markerPx/2,
            'height' :markerPx/2,
            'background-size': markerPx/2,
            // THIS NEEDS TO BE CHANGED IN ZOOM
            left: -markerPx/4 
        });
    });

    $("#mapbox").css('cursor','none');
    $('#curser_tail').show();
    // $('#curser_tail_noEntrence').hide();
  }
  
  function checkingPoints() {
    $('.map img').mousemove(function(e){
        var div = this;
        var theE = e;
        map_click.mapClickWorking(theE,div,function(result){
            canBuild = result;
            if (result) {
                // $('#curser_tail').css({
                //     'border' :'1px solid green'
                // });
                $('#curser_tail_noEntrence').hide();                
            }
            else {
                // $('#curser_tail').css({
                //     'border' :'1px solid red'
                // });
                $('#curser_tail_noEntrence').show();
            }
        });
    });
  }
}