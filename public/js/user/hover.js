$('.post').on('mouseenter', function(){
    $(this).find('.theme').css({
        display: "block",
    });
    $(this).on('mouseleave', function(){
        $(this).find('.theme').css({
            display: "none",
        });
    });
});
