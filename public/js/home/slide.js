$('.next').click(function(){
    var $head = $(this).parent().find('div[role=head]');
    var position = parseInt($head.attr('position'));
    var limit = $(this).parent().find('img').length;

    // console.log(limit);
    position +=1;
    if(position > limit - 1){
        position = 0;
    }
    var marginLeft = -position*100;
    $head.animate({
        marginLeft: `${marginLeft}%`,
    }, 300);
    $(this).parent().find('div[role=head]').attr('position', `${position}`);

});

$('.prev').click(function(){
    var $head = $(this).parent().find('div[role=head]');
    var position = parseInt($head.attr('position'));

    position -=1;
    if(position < 0){
        position = $(this).parent().find('img').length - 1;
    }

    var marginLeft = -position*100;

    $head.animate({
        marginLeft: `${marginLeft}%`,
    }, 300);
    $(this).parent().find('div[role=head]').attr('position', `${position}`);

});

$('._post-body').on('mouseenter', function(){
    $(this).find('button').fadeIn(500);
    $(this).on('mouseleave', function(){
        $(this).find('button').fadeOut(200);
    });
});


$(window).resize(function(){
    $('.post-img').css({
        width: `${$('._post').eq(0).width()}`,
    });
});
