var profile = new profileJs()
function profileJs() {
    function ctor() {
        $('.profile_bg, .profile_close').click(hidePage);
        $("#profile_exit_button").click(closeProfile);
        $(document).keyup(keyUpExit);
        
    //     setTimeout(function () {
    //         showPage(1)
    //     }, 1500)
    }
    this.ctor = ctor;

    function keyUpExit(e){
        if (e.keyCode == 27) {
            closeProfile();
        }
    }
    
    function closeProfile() {
        hidePage();
    }

    function showPage(userId) {
        $('.global_page_profile').show();
        showData(userId)
    }

    this.showPage = showPage;

    function hidePage() {
        $('.global_page_profile').hide();
    }

    function goToClan() {
        var clanId = $(".profile_holder_companyID").text()
        company.showPage(clanId)
    }

    function showData(userId) {
        getUserDetailsFromId(userId)
    }

    this.showData = showData;

    function getUserDetailsFromId(id) {
        var data = {
            userId: id
        }

        var url = "/api/users/getUserDetailsFromId/"
        global.api(url, data, function (data) {
            echoUserDetails(data);
        })
    }

    function echoUserDetails(data) {
        var userData = JSON.parse(data);
        userData = userData[0];


        $('.profile_name').text(userData.userName);
        getUserRank(userData.rank);
        getUserProfit(userData.profit);


        if (userData.companys_name == null) {
            $('.profile_holder_companyName').hide()
        }
        else {
            $('.profile_name_taagid').text(userData.companys_name);
        }
        //
        //$(".profile_holder_id").text(userData.id)
        //$('.profile_holder_companyID').text(userData.companys_id);

        $("#profile_holder_send_massage_button").click({otherUserId: userData.id}, openChat);
        $("#profile_holder_attack_button").click({otherUserId: userData.id}, attackOtherUser);
        $(".profile_name_taagid").click({otherCompanyId: userData.companys_id}, sendCompanyId);
    }

    function openChat(e) {

        var otherUserId = e.data.otherUserId;
        var otherUserName = $(".profile_name").text();
        $(".global_page_profile").hide();
        chat.openChat(otherUserId, otherUserName);
    }


    function attackOtherUser(e) {
        var otherUserId = e.data.otherUserId;
        var otherUserName = $(".profile_name").text();
        $(".global_page_profile").hide();
        alert("attack " + otherUserId);

    }


    function getUserRank(rank) {
        var realRank = rank;
        if (rank > 1000 && rank < 1000000) {
            var rank = rank / 1000 + 'K';
        } else if (rank > 1000000) {
            var rank = rank / 1000000 + 'M';
        }
        realRank = help.addComma(realRank)
        $('.profile_holder_rank_circle_number').text(rank);
        $('.profile_holder_rank_circle_hover').text(realRank);


    }

    function getUserProfit(profit) {
        var realProfit=profit;
        if (profit > 1000 && profit < 1000000) {
            var profit = profit / 1000 + 'K';
        } else if (profit > 1000000) {
            var profit = profit / 1000000 + 'M';
        }

        realProfit = help.addComma(realProfit);
        $('.profile_holder_profit_circle_number').text(profit);
        $('.profile_holder_profit_circle_hover').text(realProfit+'₪');

    }

    function sendCompanyId(e) {

        var otherCompanyId = e.data.otherCompanyId;
        closeProfile();
        company.showPage(otherCompanyId)
    }

}

