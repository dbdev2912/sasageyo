$('.dropdown-toggle').attr('drop', "0");
$('.dropdown-toggle').each(function(){
    var $this = $(this);
    $(this).click(function(){
        if($(this).attr('drop') == "0"){
            $('.dropdown-menu-container').css({
                display: "none",
            }).attr('drop', '0');

            $(this).parent().find('.dropdown-menu-container').css({
                display: "block",
            });
            $(this).attr('drop', "1");
            // $(document).on('mouseup', function(){
            //     $(this).parent().find('.dropdown-menu-container').css({
            //         display: "none",
            //     });
            //     $this.attr('drop', "1");
            // });
        }else{
            $this.attr('drop', "0");
            $(this).parent().find('.dropdown-menu-container').css({
                display: "none",
            });
        }
    });
})
