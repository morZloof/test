var progressBar = new progressBarJs()
function progressBarJs(){
	ctor()
	function ctor(){
        setTimeout(function(){
            loadProgressBar();
        },3000)
	}
	this.ctor = ctor;
	
	function showPage(){
        $(".global_page_progressBar").show()
	}
	this.showPage = showPage;
    
    function loadProgressBar() {
        var userLevel = $.globalUser.userLevel;
        var bonus = $.json_userLevels.levels[userLevel - 1].moneyBonus;
        bonus = help.addComma(bonus);
        $(".progressBar_progressHolder_bonus_num").text(bonus +'₪');
        $(".progressBar_rank").text(userLevel);

        var percentage = getPrecentage(userLevel);
        convertPercentage(percentage);
    }
    
    function convertPercentage(percentage) {
        if (percentage < 6) {
            $(".progressBar_progress").css("background-color", "#fa0000");
        } else if (percentage < 16) {

            $(".progressBar_progress").css("background-color", " #ff3100");

        } else if (percentage < 26) {
            $(".progressBar_progress").css("background-color", "#e06f00");
        } else if (percentage < 36) {
            $(".progressBar_progress").css("background-color", "#d68c1a");
        } else if (percentage < 46) {
            $(".progressBar_progress").css("background-color", "#c7a93a");
        } else if (percentage < 56) {
            $(".progressBar_progress").css("background-color", "#b3b356");
        } else if (percentage < 66) {
            $(".progressBar_progress").css("background-color", "#88b65c");
        } else if (percentage < 76) {
            $(".progressBar_progress").css("background-color", "#74c15e");
        } else if (percentage < 86) {
            $(".progressBar_progress").css("background-color", "#61c94b");
        } else if (percentage < 96) {
            $(".progressBar_progress").css("background-color", "#3fe32e");
        } else if (percentage < 101) {
            $(".progressBar_progress").css("background-color", "#00f212");
        }

        percentage = Math.floor(percentage);
        percentage += '%';
        $(".progressBar_progress").width(percentage);
        $(".progressBar_percentage").text(percentage);
    }
    
    function getPrecentage(userLevel) {
        var currentProfit = $.globalUser.profit;
        var maxProfitForLevel = $.json_userLevels.levels[userLevel - 1].nextLevel;
        var precentage = (currentProfit/maxProfitForLevel)*100;
        maxProfitForLevel = help.addComma(maxProfitForLevel);
        currentProfit = help.addComma(currentProfit);
        
        $(".progressBar_progressHolder_hover_profitNumber").text(currentProfit+'₪').css("color","red");
        $(".progressBar_progressHolder_hover_nextProfitNumber").text(maxProfitForLevel+'₪').css("color","red");

        return precentage;
    }
}