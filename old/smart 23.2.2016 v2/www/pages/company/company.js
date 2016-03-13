var company = new companyJs();
function companyJs() {
    var clanId;

    function ctor() {
        $('#company_exit_button').click(closePage);
        $('.company_new_holder_accept').click(checkCompanyName)

        /*setTimeout(function () {
            showPage(59)
        }, 1500)*/
    }

    this.ctor = ctor;

    function showPage(clanId) {
        clanId = clanId;
        global.globalHide();
        $('.global_page_company').show();
        $('.company').show();
        showData(clanId);
    }

    this.showPage = showPage;

    function showData(clanId) {
        clanId = clanId;

        getClanDetailsFromId(clanId)
    }

    function getClanDetailsFromId(clanId) {

        var data = {
            clanId: clanId
        }

        var url = "/api/company/getClanDetailsFromId/"
        global.api(url, data, function (data) {
            echoClanDetails(data, clanId);
        })
    }

    function echoClanDetails(data, clanId) {
        data = JSON.parse(data);

        //var daa = JSON.stringify(data[1]);
        //$('.company_main_users_text').hide();
        $('.company_name').text(data[0][0].name);

        getCompanyRank(data[0][0].rank);
        getCompanyProfit(data[0][0].power);
        getCompanyUserNumber(data[1].length);
        var loopLength = data[1].length;

        for (var i = 0; loopLength > i; i++) {
            var clone = $(".company_table_row:first").clone();
            clone.find(".company_cell_table_userName").text(data[1][i].userName);
            clone.find(".company_cell_table_profit").text(data[1][i].profit);
            if (data[1][i].rank != null) {
                clone.find(".company_cell_table_rank").text(data[1][i].rank);
            }
            else {
                clone.find(".company_cell_table_rank").text("none");
            }
            clone.find(".company_cell_table_action_userIsAdmin_sendMsg").click({otherUserId:data[1][i].id }, openChat);
            clone.find(".company_cell_table_action_userNotAdmin_sendMsg").click({otherUserId:data[1][i].id }, openChat);
            clone.find(".company_cell_table_action_userIsAdmin_removeUser").click({otherUserId:data[1][i].id},kickUser );

            $(".company_table_rows").append(clone);
            clone.show();

        }

        if ($.globalUser.companys_id == clanId) {
            if ($.globalUser.admin) {
                $(".company_cell_table_action_userIsAdmin").show();
            }
        }
        else {
            $(".company_cell_table_action_userNotAdmin").show();
        }


        if ($.globalUser.companys_name == null) { // IF YOU DONT HAVE COMPANY
            $('.company_oneResult_btns_joinBtn').show();
            $('.company_oneResult_btns_joinBtn').click({clanid: data[0][0].id}, addRequest)
        }
        else { // IF YOU HAVE COMPANY
            if ($.globalUser.companys_id == data[0][0].id) { // THIS IS YOUR CLAN
                $('.company_oneResult_btns_leaveBtn').show();
                $('.company_oneResult_btns_leaveBtn').click(leaveClan)
            }

        }

        //console.log(data)

    }

    function openChat(e) {

        var otherUserId = e.data.otherUserId;
        var otherUserName = $(".profile_name").text();
        $(".global_page_company").hide();
        chat.openChat(otherUserId, otherUserName);
    }

    function getCompanyRank(rank) {
        var realRank = rank;
        if (rank > 1000 && rank < 1000000) {
            var rank = rank / 1000 + 'K';
        } else if (rank > 1000000) {
            var rank = rank / 1000000 + 'M';
        }
        realRank = help.addComma(realRank)
        $('.company_holder_rank_circle_number').text(rank);
        $('.company_holder_rank_circle_hover').text(realRank);
    }

    function getCompanyProfit(profit) {
        var realProfit = profit;
        if (profit >= 1000 && profit < 1000000) {
            var profit = profit / 1000 + 'K';
        } else if (profit >= 1000000) {
            var profit = profit / 1000000 + 'M';
        }
        realProfit = help.addComma(realProfit);
        $('.company_holder_profit_circle_number').text(profit);
        $('.company_holder_profit_circle_hover').text(realProfit + '₪');

    }

    function getCompanyUserNumber(userNumber) {
        var realUserNumber = userNumber;
        if (userNumber > 1000 && userNumber < 1000000) {
            var userNumber = userNumber / 1000 + 'K';
        } else if (userNumber > 1000000) {
            var userNumber = userNumber / 1000000 + 'M';
        }
        realUserNumber = help.addComma(realUserNumber);
        $('.company_holder_userNumber_circle_number').text(userNumber);
        $('.company_holder_userNumber_circle_hover').text(realUserNumber);

    }


    function addRequest(e) {
        clanId = e.data.clanid;

        var data = {companyId: clanId}
        var url = "/api/company/sendReq/"
        global.api(url, data, function (data) {
            echojoinToSearchCompany(data)
        })
    }

    function echojoinToSearchCompany(data) {
        if (data == 'sucsses') {
            popup.showPage('בקשתך נשלחה בהצלחה')
        }
        if (data == 'you all ready send req') {
            popup.showPage('יש לך כבר בקשה ממתינה')
        }
        if (data == 'you have country') {
            popup.showPage('לא ניתן להצטרף ליותר מברית אחת')
        }
    }

    function showPopupPage() {
        global.globalHide();
        $('.global_page_company').show();
        $('.company_new').show();
    }

    this.showPopupPage = showPopupPage;

    function createNewCompany() {
        var companyJs = buildingsJson.getJson(4).levels[0];
        var time = buildingsJson.getTime(4, 1)

        var profit = companyJs.profit
        profit = help.addComma(profit);

        $(".company_new_holder_image").attr("src", companyJs.img);
        $(".company_new_holder_time span").html(time);

        $('.company_new_holder_data1 span').text(companyJs.price)
        $('.company_new_holder_data2 span').text(profit)

        //$('.company_new_holder_accept').click({pic: companyJs.img, price:companyJs.price}, aprroveBuildingCompany)
    }

    this.createNewCompany = createNewCompany;

    function checkCompanyName() {
        var url = "/api/company/checkCompanyName/";
        var companyName = $(".company_new_holder_input_companyName").val();

        var data = {
            companyName: companyName
        }

        global.api(url, data, function (data) {
            if (data == 'error: name exist') {
                valert.showPage('השם תפוס, אנא בחר שם אחר')
            }
            else {
                aprroveBuildingCompany()
            }
        })
    }

    function aprroveBuildingCompany(e) {
        var companyJs = buildingsJson.getJson(4).levels[0];

        global.globalHide();
        global.showDashboard();
        vmap.buyHouseAlert(companyJs.img, 4, companyJs.price)
    }

    function getNewCompanyName() {
        var companyName = $('.company_new input').val();
        return companyName;
    }

    this.getNewCompanyName = getNewCompanyName;

    function closePage() {
        global.globalHide();
        global.showDashboard();
    }

    function leaveClan() {
        var url = "/api/company/leaveCompany/"
        var data = {}
        global.api(url, data, function (data) {
            global.showDashboard();
            popup.showPage('עזבת את התאגיד בהצלחה')

            global.getUser();
            $('.header_cont_company').unbind('click');

            $('.header_cont_company').text('צור תאגיד')
            $('.header_cont_company').click(header.createCompany);

        })
    }

    function kickUser(e) {
        $(".global_page_company").hide();
        var text = 'האם אתה רוצה להסיר את המשתמש מהתאגיד?'
        choicePopup.showPage(text, function (yesNo) {
            if (yesNo) {
                var userId = e.data.otherUserId;

                var data = {user_id: userId}
                var url = "/api/company/removeUserFromCompany/"
                global.api(url, data, function (data) {
                    echoKickUser(data)
                })
            }
        });

    }

    function echoKickUser(data) {
        popup.showPage('הסרת את המשתמש מהתאגיד')
        showPage($.globalUser.companys_id);

    }

    function showUserProfile(e) {
        var userId = e.data.userId;
        profile.showPage(userId);
    }

    function sendMsgToUser(e) {
        var userId = e.data.userId;
        var userName = e.data.userName;
        chat.openChat(userId, userName);

    }
}
