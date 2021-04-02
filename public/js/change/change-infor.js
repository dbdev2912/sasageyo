$('.option-container').eq(0).attr('class', 'option-container chosen');
$('.prevent-default').on('click', function(e){
    e.preventDefault();
})

$('#psedo-btn').click(function(){
    $("#file").click();
    $("#file").change(function(){
        $(this).parent().submit();
    });
});
