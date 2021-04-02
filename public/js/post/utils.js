$(function(){
    $('#to-change').click(function(){
        window.location = $(this).attr('href');
    })
});

$('.profile-link').click(function(){
    window.location = $(this).text();
});

$('.move-to-addpost').click(function(){
    window.location = $('.move-to-addpost').eq(0).attr('href');
});

$('.post').eq(0).attr('pos', 'start');
$('.post').eq($('.post').length - 1).attr('pos', 'end');



$('.post-img').css({
    width: `${$('._post').eq(0).width()}px`,
});

$('._post-body').css({
    minWidth: "none",
    height: `${$('._post').eq(0).width()}px`,
});

$('.imgs-container').css({
    height: `${$('._post').eq(0).width()}px`,
});

$('.make-comment').css({
    position: "absolute",
    bottom: "5px",
    right: "0px",
});
$('.width-40').css({
    height: `${$('._post').eq(0).height() + 2}px`,
});

$(window).resize(function(){
    $('.post-img').css({
        width: `${$('._post').eq(0).width()}px`,
        height: `${$('._post').eq(0).width()}px`,
    });
    $('._post-body').css({
        height: `${$('._post').eq(0).width()}px`,
    });
    $('.imgs-container').css({
        height: `${$('._post').eq(0).width()}px`,
    });
    $('.width-40').css({
        height: `${$('._post').eq(0).height() + 2}px`,
    });
});
