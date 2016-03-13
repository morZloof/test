var war = new warJs()
function warJs(){

	function ctor(){
        $('.war_grid_goBack').click(goBack)
        $('.war_startPage_searchBox_searchRandomRresturant').click(getRandomRresutrant)
        
        $(".war_mission10_text_submit").click(countinoMission10_2);
        $(".war_mission10_textReturn_submit").click(countinoMission10_return);
        $(".war_mission10_choosePrice_text_submit").click(countinoMission10_price);
    }
	this.ctor = ctor;
	function showPage(){
        $('.war_cont').hide();

		$(".global_page_map").hide()
		$(".global_page_war").show();
        $('.war_startPage').show(); 
        $('.war_startPage_assets').hide();      
        $('.war_startPage_users').hide();
        $('.war_startPage_searchBox').val('')
		global.resizePage();
        checkSearchInput();
        
        if($.globalUser.mentor==10){
            $(".notebookNav").removeClass('mentor_notBlock')
            $(".war_mission10").addClass('mentor_notBlock')
            $(".war_mission10_text").show();
            
            clearInterval($.mentorHaz_level10_0);
            $(".notebookNav_mission10").hide();
            
            clearInterval($.mentor_level10_hazMap);
            $(".map_mentor_level10Haz").hide()
        }
        else{
            $(".war_mission10").hide()
            $(".war_mission10_text").hide()
        }
	}
	this.showPage = showPage;

    function countinoMission10_return(){
        $(".war_mission10_textReturn").hide()
        clearInterval($.mentor_level10_hazReturn);
        $.mentor_level10_hazReturn = setInterval(function(){
            $(".war_mission10_return").fadeToggle(100)
        },500)
    }
    function countinoMission10_price(){
        $(".war_mission10_choosePrice_text").hide() 
        
        clearInterval($.mentor_level10_hazReturn);
        $.mentor_level10_hazChoosePrice = setInterval(function(){
            $(".war_mission10_choosePrice").fadeToggle(100)
        },500)
    }
    function countinoMission10_2(){
        $(".war_mission10_text").hide()
        $(".war_startPage_searchBox_searchRandomRresturant").addClass('mentor_notBlock');
        clearInterval($.mentorHaz_level10_1);
        $.mentorHaz_level10_1 = setInterval(function(){
            $(".war_mission10").fadeToggle(100);
        },500);
    }
    
	function factoryForResturant(resturant, currentBid) {
        if($.globalUser.mentor==10){
            $(".war_mission10_textReturn").show()
        }
        
		showPage();
        $('.war_startPage').hide();

        if (currentBid == null) // NO SUPPLIER! 
        {
            $('.war_grid_title').hide();
            $('.war_userCol').css('width', '100%'); 
            $('.war_grid war_enemyCol').hide();           
        }
        else {
            $('.war_grid_title').show();
            $('.war_userCol').css('width', '48%');      

            $('.war_enemyCol').find('.war_grid_title').text(currentBid.userName);
            $('.war_enemyCol').find('.war_grid_resturentIncome').text(help.addComma(resturant.profit));
            $('.war_enemyCol').find('.war_grid_expense').text(help.addComma(currentBid.bid));
             
            var data = {
                store_id:currentBid.store_id
            }
                
            var url = "/api/war/getFactoryBid/"
            global.api(url,data,function(data){
                setCurrectBidFactory(JSON.parse(data), resturant.profit);
            })
                              
        }
        $('.war_cont').show();
        $('.war_title').find('span').text('רכישת לקוחות');
		var userBuildings = $.globalUserBuilding;
        var userName = $.globalUser.userName;
        var factoryId;
        $('.war_userCol').find('.war_grid_title').text(userName)
        $('.war_grid_line_oneElement').hide();
        
        if (resturant.type_id == '2') { // THIS IS RESTURANT
            factoryId = '3' // SHOW FOOD FACTORY
        }
        
         if (resturant.type_id == '6') { // THIS IS CLOTHING STORE
            factoryId = '7' // SHOW CLOTHING FACTORY
        }
        var userGotFactory = 0;        
		for (var i=0; i< userBuildings.length; i++) {
			if (userBuildings[i].type_id == factoryId) {
                userGotFactory = 1;
                var onePic = $('.war_grid_line_oneElement:first').clone();
				var buildingPic = buildingsJson.getImageUrl(userBuildings[i].type_id,userBuildings[i].level)
                var benefit = formulas.factoryCalculate(userBuildings[i].level,resturant.profit)
				
                onePic.find('img').attr('src',buildingPic);

                onePic.find('.war_grid_line_oneElement_text_beneift').text(help.addComma(benefit))
                $('.war_grid_factoryLine').append(onePic);
                onePic.click({factory:userBuildings[i], resturant:resturant}, choosenFactory )
                onePic.show();
			}
		}
        
        if (!userGotFactory) { // NO RELEVENT FACTORY FOUND
            $('.war_userCol').find('.war_grid_description').html('!לא נמצאו מפעלים<br> בשביל לבצע מהפכה כלכלית, חובה לבנות מפעלים')
        }
        // CURRENT BID
        
	}
	this.factoryForResturant = factoryForResturant;
    
    
	function goBack() {
        $('.war_holder').hide();
        $('.war_startPage').show();
        $('.war_startPage_assets').show();      
    }
	function showRequest(newBid, reqId) {
        
        var maxRange = formulas.factoryCalculate(newBid[3][0].level,newBid[2][0].profit)
        
		showPage();

        // if (currentBid == null) // NO SUPPLIER! 
        // {
            $('.war_grid_title').hide();
            $('.war_userCol').css('width', '100%');            
        // }
        // else {
   
                              
        // }
        // SHOWING AND HIDING THINGS
        $('.war_cont').show();
        $('.war_grid_line_oneElement').hide();
        $('.war_grid_description').hide();
        $('.war_startPage').hide();
         
        $('.war_startPage_stickyNote_text').hide();
        $('.war_startPage_stickyNote_player').hide();
        $('.war_startPage_stickyNote_bid').show();
        
        $('.war_grid_summ').show();
        $('.war_title').find('span').text('רכישת לקוחות');
        $('.war_grid_summ').find('.war_grid_description:first').text('צפייה בהצעת מחיר')
        $('.war_grid_summ').find('.war_grid_description').show();
        $('.war_userCol').find('input[type=range]').hide();
        $('.war_grid_factoryDetails').hide();
        // SETTING OFFER PARAMATERS
        $('.war_userCol').find('.war_grid_description').find('span').text(help.addComma(newBid[0][0].bid))
        
        $('.war_userCol').find('.war_grid_factoryLevelColuc').text(help.addComma(maxRange));
        $('.war_userCol').find('.war_grid_resturentIncome').text(help.addComma(newBid[2][0].profit));
        var totalIncome = newBid[2][0].profit+maxRange;
        $('.war_userCol').find('.war_grid_totalIcon').text(help.addComma(totalIncome));
        $('.war_userCol').find('.war_grid_expense').text(help.addComma(newBid[0][0].bid));
        var totalProfit = totalIncome - newBid[0][0].bid;
        $('.war_userCol').find('.war_grid_totalProfit').text(help.addComma(totalProfit)); 

        $('.war_grid_approveBtn').text('אישור להצעת המחיר')
        $('.war_grid_approveBtn').click({reqId:reqId},approveBid) 
        $('.war_grid_cancelBtn').show(); 
        $('.war_grid_cancelBtn').click({reqId:reqId},cancelBid) 
	}
    this.showRequest = showRequest;
    
    function approveBid(e) {    
        var data = {
            notification_id:e.data.reqId
            }
            
		var url = "/api/war/comfirmReq/"
		global.api(url,data,function(data){
           echoApproveBid(data)
		})
        
    }
    function cancelBid(e) {       
        var data = {
            notification_id:e.data.reqId
            }
            
		var url = "/api/war/cancelReq/"
		global.api(url,data,function(data){
           echoCancelBid(data)
		})
        
    }
    
    function echoCancelBid(data) {
        if (data == 'success') {
		    global.globalHide();
		    global.showDashboard();
            popup.showPage('סירבת להצעת המחיר')
        }
    }
    
    function echoApproveBid(data) {
        if (data == 'success') {
		    global.globalHide();
		    global.showDashboard();
            popup.showPage('הבקשה אושרה בהצלחה')
        }
    }
    function choosenFactory(e) {
        var json = e.data.factory;
        var resturant = e.data.resturant;
        var maxRange = formulas.factoryCalculate(json.level,resturant.profit)
        var rangeValue = '0'

        $('.war_grid_line_oneElement_text').hide();
        $('.war_userCol').find("input[type=range]").val(rangeValue);
        $('.war_grid_line_oneElement').removeClass('war_grid_line_oneElementActive');
        $(this).addClass('war_grid_line_oneElementActive');
        
        $('.war_grid_summ').show();
        $('.war_userCol').find('input[type=range]').attr('max',maxRange )
        
        $('.war_userCol').find('.war_grid_description').find('span').text(rangeValue)
        $('.war_userCol').find('.war_grid_expense').text(rangeValue);
        
        
        $('.war_userCol').find('.war_grid_factoryStreet').text(decodeURIComponent(json.street))
        $('.war_userCol').find('.war_grid_factoryProfit').text(json.profit)

        $('.war_userCol').find('.war_grid_factoryLevel').text(json.level)
        $('.war_userCol').find('.war_grid_factoryLevelColuc').text(maxRange)
        $('.war_userCol').find('.war_grid_resturentIncome').text(resturant.profit);
        var totalIncome = resturant.profit+maxRange;
        $('.war_userCol').find('.war_grid_totalIcon').text(totalIncome)
            
        $('.war_userCol').find('.war_grid_totalProfit').text(totalIncome);    
            
        $('.war_userCol').find('input[type=range]').on('change', function() {
            /* for mentor level 10 */
            clearInterval($.mentor_level10_sendAttack)
            $.mentor_level10_sendAttack = setInterval(function(){
                $(".war_mission10_sendAttack").fadeToggle(100);
            },500)
            
            $(".war_mission10_choosePrice").hide();
            clearInterval($.mentor_level10_hazChoosePrice);
            
            if($.globalUser.mentor==10){
                $(".war_grid_approveBtn").show()
            }
            /* for mentor level 10 */
            
            rangeValue = $('.war_userCol').find("input[type=range]").val();
            $('.war_userCol').find('.war_grid_description').find('span').text(rangeValue);
            $('.war_userCol').find('.war_grid_expense').text(rangeValue);
            totalProfit = totalIncome - rangeValue;
            $('.war_userCol').find('.war_grid_totalProfit').text(totalProfit);    
        });
        $('.war_grid_cancelBtn').hide();
        $('.war_grid_approveBtn').css('margin-left','-100px');
        $('.war_grid_approveBtn').click({storeId:resturant.id, factoryId:json.id, bid:rangeValue,maxRange:maxRange},submitOffer)
        
        if($.globalUser.mentor==10){
            clearInterval($.mentor_level10_hazReturn);
            $(".war_mission10_return").hide()
            $(".war_grid_approveBtn").hide()
            
            $(".war_mission10_choosePrice_text").show();
        }
        else{
            $(".war_grid_approveBtn").show()
        }
    }
    
    function submitOffer(e) {
        var bid = e.data.maxRange - $(".war_grid_descriptionEarn span").text();
        var data = {
                my_building_id: e.data.factoryId,
                store_id:e.data.storeId,
                bid:bid
            }
            
		var url = "/api/war/attack/"
		global.api(url,data,function(data){
           if($.globalUser.mentor!=10){
                echoSubmitResult(data)
           }
           
            if($.globalUser.mentor==10){
                $.globalUser.mentor=11;
                clearInterval($.mentor_level10_sendAttack);
                $(".war_mission10_sendAttack").hide();
                global.getUser();
                mentor.finishLevel10();
            }   
		})
    }
    
    function echoSubmitResult(data) {
        if (data == 'ok') {
		    global.globalHide();
		    global.showDashboard();
            popup.showPage('בקשה נשלחה בהצלחה')
            vmap.closeFlow()
        }
        else if (data == 'error: you can send only one req') {
            valert.showPage('ניתן לשלוח רק בקשה אחת')
            
        }
        else {
            valert.showPage('לא ניתן לשלוח את הבקשה')
        }
    }
    
    function checkSearchInput() {
        $('.war_startPage_searchBox').keypress(function(event){	
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $('.war_startPage_users').hide();
                $('.war_startPage_assets').hide();
                var text = $('.war_startPage_searchBox').val();
                if (text.length < 2) {
                    valert.showPage('שם המשתמש חייב להיות גדול מ2')
                }
                else {
                    searchUser(text);
                }
            }
        });
    }
    
    function searchUser(query) {
        var data = {
            userName:query
            }
            
		var url = "/api/war/searchUser/"
		global.api(url,data,function(data){
           echoSearchResult(JSON.parse(data));
		})
        
    }
    function echoSearchResult(data) {
      $('.war_startPage_users_oneuser').hide()
        if (data.length == 0) {
           valert.showPage('לא נמצאו משתמשים')
        }
        else if (data.length > 1) {
            $('.war_startPage_users').show();
              $('.war_startPage_users_title').text(':נמצאו');
              $('.war_startPage_users_title').append(' <span></span> ');
              $('.war_startPage_users_title').append('משתמשים. בחר משתמש');
              $('.war_startPage_users_title').find('span').text(data.length);
            
            for (var i=0; i<data.length; i++) {
                var oneUser = $('.war_startPage_users_oneuser:first').clone();
                oneUser.find('.war_startPage_users_oneuser_name').find('span').text(data[i].userName)
                oneUser.find('.war_startPage_users_oneuser_rank').find('span').text(data[i].rank)
                oneUser.find('.war_startPage_users_oneuser_profit').find('span').text(data[i].profit)
                $('.war_startPage_users').append(oneUser);
                oneUser.show();
                oneUser.click({data:data[i].id}, showAssetsHelper)  
            }
        }
        else if (data.length == 1) {
            (showAssets(data[0].id))
        }
    }
    
    function showAssetsHelper(e) {
        showAssets(e.data.data);
    }
    function showAssets(data) {
        $('.war_startPage_users').hide();
        
        var data = {
            user_id:data
            }
            
		var url = "/api/war/getUserRestuarants/"
		global.api(url,data,function(data){
           echoAssets(JSON.parse(data));
		})
    }
    
    function echoAssets(data) {
        
        var bidData; 
        $('.war_startPage_stickyNote_text').hide();
        $('.war_startPage_stickyNote_bid').hide();
        $('.war_startPage_stickyNote_player').show();
        
        $('.war_startPage_assets_resturents_oneBuilding').hide()
        $('.war_startPage_assets_resturents_oneClient').hide()
        $('.war_startPage_users').hide();

        if (data[0].length == 0) {
            $('.war_startPage_assets_buildings_title').text('לא נמצאו מסעדות')
        }
        else if (data[0].length > 0) {
            
            $('.war_startPage_assets').show();
            
            for (var i=0; i<data[0].length; i++) {
                var oneBuilding = $('.war_startPage_assets_resturents_oneBuilding:first').clone();
                var supplier;
                var buildingPic = buildingsJson.getImageUrl(data[0][i].type_id, data[0][i].level)
                if (data[0][i].other == null) { // IF NO SUPPLIER
                    supplier = 'ללא'
                    bidData = null;
                }
                else {
                    for (var j=0; j<data[1].length; j++) {
                        if (data[1][j].factory_id == data[0][i].other) {
                            supplier = data[1][j].userName;
                            bidData = data[1][j];
                        }
                    }
                }
                
                oneBuilding.find('.war_startPage_assets_resturents_oneBuilding_pic').attr('src',buildingPic)
                oneBuilding.find('.war_startPage_assets_resturents_oneBuilding_level').find('span').text(data[0][i].level)
                oneBuilding.find('.war_startPage_assets_resturents_oneBuilding_profit').find('span').text(help.addComma(data[0][i].profit))
                oneBuilding.find('.war_startPage_assets_resturents_oneBuilding_street').find('span').text(decodeURIComponent(data[0][i].street))
                oneBuilding.find('.war_startPage_assets_resturents_oneBuilding_supplier').find('span').text(supplier)
                $('.war_startPage_assets_buildings').append(oneBuilding);
                oneBuilding.show();
                
                oneBuilding.click({data:data[0][i], bid:bidData}, factoryForResturantHelper)  

            }
        }

 
        if (data[2].length == 0) {
            $('.war_startPage_assets_clients_title').text('לא נמצאו לקוחות')
        }
        
        else if (data[2].length > 0) {
            $('.war_startPage_assets').show();
            
            for (var i=0; i<data[2].length; i++) {
                var oneClient = $('.war_startPage_assets_resturents_oneClient:first').clone();
                var clientName;
                var buildingPic = buildingsJson.getImageUrl(data[2][i].type_id, data[2][i].level)

                for (var j=0; j<data[4].length; j++) {

                    if (data[4][j].id  == data[2][i].users_id) 
                        clientName = data[4][j].userName;
                }
                

                
                oneClient.find('.war_startPage_assets_resturents_oneClient_pic').attr('src',buildingPic)
                oneClient.find('.war_startPage_assets_resturents_oneClient_profit').find('span').text(data[2][i].profit)
                oneClient.find('.war_startPage_assets_resturents_oneClient_street').find('span').text(decodeURIComponent(data[2][i].street))
                oneClient.find('.war_startPage_assets_resturents_oneClient_client').find('span').text(clientName)
                
                $('.war_startPage_assets_clients').append(oneClient);
                oneClient.show();
                

                oneClient.click({data:data[2][i], bid:data[3][i] }, factoryForResturantHelper)  
            }
        }
    }
    
    function factoryForResturantHelper(e) {
       var resturant = e.data.data;
       var bid = e.data.bid;
       $('.war_holder').show()
        factoryForResturant(resturant, bid)
    }
    
    function setCurrectBidFactory(data,profit) {
        var json = data[0];
        var coluc = formulas.factoryCalculate(json.level,profit)
        var totalIncome = profit+coluc;
        var expence = $('.war_enemyCol').find('.war_grid_expense').text();
        var totalResturantIncome = totalIncome - expence;
        
        $('.war_enemyCol').find('.war_grid_factoryStreet').text(decodeURIComponent(json.street))
        $('.war_enemyCol').find('.war_grid_factoryProfit').text(json.profit)
        $('.war_enemyCol').find('.war_grid_factoryLevel').text(json.level)
        
        $('.war_enemyCol').find('.war_grid_factoryLevelColuc').text(coluc)
        $('.war_enemyCol').find('.war_grid_totalIcon').text(totalIncome)
        $('.war_enemyCol').find('.war_grid_totalProfit').text(totalResturantIncome)
    }
    
    function getRandomRresutrant() {
        var data = {
            isRestuarant:1
        }
            
        var url = "/api/war/randomRestuarant/"
        global.api(url,data,function(data){
            zoomToResturnat(JSON.parse(data));
        })
        
        if($.globalUser.mentor==10){
            $(".mentor_block").hide()
            clearInterval($.mentorHaz_level10_1);
            $(".war_mission10").hide();
        }
    }
    this.getRandomRresutrant = getRandomRresutrant;
    
    var canZoom = 1;
    function zoomToResturnat(data) {
        if(canZoom==1){
            canZoom = 0;
            vmap.makeMapLarger();
            
            var resturant = data[0];
            var markers = [];
            
            vmap.zoomToMainBuilding(resturant.lng,resturant.lat);
            notebookNav.showMap();
            // map_lookAround.sendCornersToAPI();
            
            setTimeout(function(){
                var markers = [];
                
                vmap.map.eachLayer(function(marker) { markers.push(marker); });
                for (var i=0; i<markers.length; i++) {
                    if((typeof markers[i]._latlng != 'undefined') && (typeof markers[i]._popup != 'undefined') ) {
                        var m = markers[i].getLatLng();
                        if (resturant.lng == m.lat && resturant.lat == m.lng) {
                            markers[i].openPopup();
                            vmap.zoomToMainBuilding(resturant.lng,resturant.lat);
                        }
                        else {
                            if(typeof markers[i]._popup == 'undefined') {
                                markers[i].closePopup();
                            }
                        }
                    }
                }
            },1000)
            setTimeout(function(){
                canZoom = 1;
                var markers = [];
                
                vmap.map.eachLayer(function(marker) { markers.push(marker); });
                for (var i=0; i<markers.length; i++) {
                    if((typeof markers[i]._latlng != 'undefined')) {
                        var m = markers[i].getLatLng();
                        if (resturant.lng == m.lat && resturant.lat == m.lng) {
                            markers[i].openPopup();
                            vmap.zoomToMainBuilding(resturant.lng,resturant.lat);
                        }
                    }
                }
            },2000)
            
            $('.map_randomClient').show();
            
            if($.globalUser.mentor==10){
                $('.war_enemyCol').hide();
                
                clearInterval($.mentor_level10_hazMap);
                $.mentor_level10_hazMap = setInterval(function(){
                    $(".map_mentor_level10Haz").fadeToggle(100);
                },500)
                
                vmap.disableMove();
                $('.map_randomClient').hide();
            }
            else{
                $('.map_randomClient').show();
            }
        }
    }
	
}
