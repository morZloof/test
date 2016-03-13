var faq = new faqJs()
function faqJs() {
    function ctor() {
        getLanguage();
    }
    this.ctor = ctor;

    function showPage() {
        global.globalHide();
        $('.header_link').removeClass('active')
        $(".header_qa").addClass('active')

        $(".global_page_faq").show();
    }
    this.showPage = showPage;


    function getLanguage() {
        global.getLanguage('faq', function (xml) {
            xml = $(xml);
            echoLanguage(xml);
        })
    }

    function echoLanguage(xml) {

        var size = xml.find('row').size();
        $(".faq_header_xml").append(xml.find('title').text());

        //main loop insert head questions and answer
        for (var i = 0 ; i < size; i++) {
            getMainQuestionAndAnswerFromXml(xml, i);
        }


        function getMainQuestionAndAnswerFromXml(xml, i) {

            var question = xml.find('row').eq(i).find('question').text();
            var sizeQ = xml.find('row').eq(i).find('question_down').size();
            var answer = xml.find('row').eq(i).find('answer').text();

            var faq_details = $("<div class='faq_details'> <div class='faq_quest' > <a class='faq_row_question'>" + (i + 1) + '. ' + question +
                "<div class='faq_triangle_down'> </div></a> <div class='faq_inside_question'> <p class='faq_answer'>" + answer +
                "</p> <div class='faq_sub_questions'>  </div> <div class='faq_sub_pushed_questions'></div>  </div> </div></div>");
            $('.faq_row').append(faq_details);

            //nested loop for getting sub questions and sub answers
            for (var j = 0; j < sizeQ; j++) {

                var subquestion = xml.find('row').eq(i).find('question_down').eq(j).text();
                var subanswer = xml.find('row').eq(i).find('answer_down').eq(j).text();

                faq_details.find('.faq_sub_questions').append("<div class = 'faq_sub_question_link' > <a class = 'faq_sub_question_link_" + (j + 1) + "'>" + subquestion + "<br class='faq_br'></a></div> ");
                faq_details.find('.faq_sub_questions').append(" <div class = 'faq_choosen_sub_question' ><div class='faq_choosen_sub_question_" + (j + 1) + "'>" + (i + 1) + '.' + (j + 1) + ". " + subquestion +
                      "<p class='faq_move_sub_answer'>" + subanswer + "</p></div></div>");
            }

            //nested loop for pushing and copy sub question to parent "faq_sub_pushed_questions"
            for (var j = 0; j < sizeQ; j++) {
                var pushedSubQuestion = "faq_pushed_sub_question_" + (j + 1);

                var subquestion = xml.find('row').eq(i).find('question_down').eq(j).text();
                var subanswer = xml.find('row').eq(i).find('answer_down').eq(j).text();

                faq_details.find('.faq_sub_pushed_questions').append("<div class = " + pushedSubQuestion + " style= 'display: none;'> <a class ='faq_go_back'> חזור למעלה  </a> <p class= 'faq_pushed_sub_question_bold'>"
                    + (i + 1) + '.' + (j + 1) + ". " + subquestion + "</p> <p class ='faq_pushed_sub_answer'>" + subanswer + "</p>  </div>");

            }
        }
        // when clicked head question
        $(".faq_row_question").click(function () {

            if ($(this).siblings('.faq_inside_question').css('display') == 'none') {
                $(this).siblings('.faq_inside_question').show();
            } else {
                $(this).siblings('.faq_inside_question').hide();
            }
            $(this).find('.faq_triangle_down').toggleClass('faq_clicked');
            $(this).toggleClass('faq_row_question_clicked');

            if ($('#faq_tzamtzem').css({ 'color': 'dimgrey' })) {
                if ($('.faq_inside_question').is(":visible")) {
                    $('#faq_tzamtzem').css({ 'color': 'dimgrey' });
                } else {
                    $('#faq_tzamtzem').css({ 'color': 'gainsboro' });
                }
            }

        });

        //when click on sub question
        $(".faq_sub_question_link").click(function () {
            var className = "." + $(this).children().get(0).className;
            var classContent = $(this).find(className).text();
            var id = className.slice(-1);
            var classNameToCheck = ".faq_pushed_sub_question_" + id;

            if ($(classNameToCheck).css('display') == 'none') {
                $('.faq_sub_pushed_questions').show();
                $(classNameToCheck).show();
            } else {
                $(classNameToCheck).hide();
            }

        });

        $(".faq_go_back").click(function () {

            $(this).parent().hide();

        });



        //when click on 'tzamtzem'
        $("#faq_tzamtzem").click(function () {
            if ($('#faq_tzamtzem').css({ 'color': 'gainsboro' })) {
                $('.faq_choosen_sub_question').hide();
                $('.faq_inside_question').hide();
                $('.faq_row_question_clicked').css({ 'color': 'dimgray', 'font-weight': '500' });
                $('#faq_tzamtzem').css({ 'color': 'gainsboro' });
                $('.faq_triangle_down').removeClass('faq_clicked');
                $('.faq_sub_pushed_questions').hide();

            }
        });

    }
}