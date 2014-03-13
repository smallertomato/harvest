;$(function() {
    $('.page-region-content').load('/doc/ajax/' + jade.article);
    $('.sub-menu li a').on('click', function (e) {
        e.preventDefault();
        var article = $(this).attr('href');
        $('.page-region-content').load('/doc/ajax/' + article);
        window.history.pushState(null, article , '/doc/' + article);
        return false;
    });
});