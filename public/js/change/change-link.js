$('.option-container').click(function(){
    window.location = $(this).attr('href');
})

$('#gender-switch').click(function(){

    $('.dark-theme').css({
        display: "block",
    });

    $(this).blur();
});

$('#close').click(function(){
    $('.dark-theme').css({
        display: "none",
    });
});

$('.gender-form').find('.radio-input').focus(function(){
    $('.radio-input').removeAttr('name');
    $('.radio-label').css({
        fontWeight: "unset",
        fontSize: "18px",
        marginLeft: "15px",

    });
    $('#hidden').css({
        display: "none",
    }).find('input').removeAttr('name', 'gender');
    $(this).parent().find('.radio-label').css({
        fontWeight: "bold",
        fontSize: "20px",
        marginLeft: "10px",
    }).parent().find('input').attr('name', 'gender');
    $('.gender-form').find('.radio-input').attr('class', 'radio-input');
    $(this).attr('class', 'radio-input focus').blur();
});

$('.radio-label').click(function(){
    $('.radio-input').removeAttr('name');
    $('.radio-label').css({
        fontWeight: "unset",
        fontSize: "18px",
        marginLeft: "15px",
    });
    $('#hidden').css({
        display: "none",
    }).find('input').removeAttr('name', 'gender');
    $(this).css({
        fontWeight: "bold",
        fontSize: "20px",
        marginLeft: "10px",
    }).parent().find('input').attr('name', 'gender');;
    $(this).parent().parent().find('.radio-input').attr('class', 'radio-input');
    var nth = $(this).attr('nth');
    $(`input[nth='${nth}']`).attr('class', 'radio-input focus');
});


$('.other').click(function(){
    $('.radio-input').removeAttr('name');
    $('#hidden').css({
        display: "block",
    }).find('input').attr('name', 'gender');
});
