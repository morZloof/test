var work = new workJs()
function workJs() {
    function ctor() {
    }
    this.ctor = ctor;

    function showPage() {
        global.globalHide();
        $('.header_link').removeClass('active')
        $(".header_how_it_works").addClass('active')

        $(".global_page_work").show();
    }
    this.showPage = showPage;
}