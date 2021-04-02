$('.option-container').eq(1).attr('class', 'option-container chosen');

$('.form-img').css({
    width: "50px",
}).parent().parent().css({
    height: "100px",
}).find('.profile-name').css({
    fontSize: "24px",
    fontWeight: "400",
    lineHeight: "38px",
});

$('.prevent-default').click(function(e){
    e.preventDefault();
});
