$('.messenger').css({
    height: `${$(window).innerHeight() - 115}px`,
    minHeight: `200px`,
});
$('#input').css({
    width: `${$('#input').parent().width()-100}px`,
});

$('.messages-container').css({
    height: `${$('.messenger').height()-120}px`,
});

$(window).resize(function(){

    $('#input').css({
        width: `${$('#input').parent().width()-100}px`,
    });

});

$(function(){
    $('.messages-container').scrollTop($('.messages-container').find('div').eq($('.messages-container').find('div').length-1).offset().top + 1000);

    $('.messenger-user').eq(0).click();

});
