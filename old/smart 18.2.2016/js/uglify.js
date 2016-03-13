/*var fs = require('fs');
var uglify = require("uglify-js");

var uglified = uglify.minify([
   './json/corporate.js',
   './json/foodFactory.js',
   './json/mainBuilding.js',
   './json/residential.js',
   './json/restaurant.js',
   './json/accountant.js',
   './json/clothingStore.js',
   './json/clothingFactory.js',

   './www/globalJs/global.js',
   './www/globalJs/load.js',
   './www/globalJs/pages.js',
   './www/globalJs/buildingsJson.js',
   './www/globalJs/help.js',

   './clientJs/formulas.js',
   './www/socket.io-client/socket.io.js',

   './www/header/header.js',
   './www/header/header_notifcations.js',

   './www/header/header.js',
   './www/header/header_notifcations.js',

   './www/pages/login/login.js',
   './www/pages/notebook/notebook.js',
   './www/pages/war/war.js',
   './www/pages/addBuilding/addBuilding.js',
   './www/pages/feed/feed.js',
   './www/pages/map/map.js',
   './www/pages/map/map_lookAround.js',
   './www/pages/map/map_findStreetName.js',
   './www/pages/map/map_click.js',
   './www/pages/map/map_relationship.js',
   './www/pages/youtube/youtube.js',
   './www/pages/company/company.js',
   './www/pages/petek/petek.js',
   './www/pages/runningTimes/runningTimes.js',
   './www/pages/payment/payment.js',
   './www/pages/profile/profile.js',
   './www/pages/upgradeBuilding/upgradeBuilding.js',
   './www/pages/mentor/mentor.js',
   './www/pages/chat/chat.js',
   './www/pages/bgElements/bgElements.js',
   './www/pages/searchResults/searchResults.js',
   './www/pages/choicePopup/choicePopup.js',
   './www/pages/popup/popup.js',
   './www/pages/rank/rank.js',
   './www/pages/alert/alert.js'
]);

fs.writeFile('www/globalJs/javascript.min.js', uglified.code, function (err){
 if(err) {
   console.log(err);
 } else {
   console.log("Script generated and saved:", 'concat.min.js');
 }
});
//
var fs = require('fs');
var uglifycss = require("uglifycss");

var uglifycss = uglifycss.processFiles([
   './www/header/header.css',
   './www/pages/login/login.css',
   './www/pages/notebook/notebook.css',
   './www/pages/war/war.css',
   './www/pages/addBuilding/addBuilding.css',
   './www/pages/feed/feed.css',
   './www/pages/map/map.css',
   './www/pages/youtube/youtube.css',
   './www/pages/company/company.css',
   './www/pages/petek/petek.css',
   './www/pages/runningTimes/runningTimes.css',
   './www/pages/payment/payment.css',
   './www/pages/profile/profile.css',
   './www/pages/upgradeBuilding/upgradeBuilding.css',
   './www/pages/mentor/mentor.css',
   './www/pages/chat/chat.css',
   //'./www/pages/bgElements/bgElements.css',
   './www/pages/searchResults/searchResults.css',
   './www/pages/choicePopup/choicePopup.css',
   './www/pages/popup/popup.css',
   './www/pages/rank/rank.css',
   './www/pages/alert/alert.css',
]);

fs.writeFile('www/globalJs/style.min.css', uglifycss, function (err){
 if(err) {
   console.log(err);
 } else {
   console.log("Script generated and saved:", 'style.min.css');
 }
});*/