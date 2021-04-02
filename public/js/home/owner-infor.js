$('.owner-infor').each(function(){
    var $this = $(this);

    var token = $this.find('.token').attr('id');

    $.ajax({
        url: '/getFollowedInfor',
        data: {
            user_id: token,
        },
        type: "POST",
        success: function(resp){
            var followed  = resp.followed,
                following = resp.following,
                postCount = resp.postCount;

            $this.find('.post-count').text(postCount);
            $this.find('.followed-count').text(followed);
            $this.find('.following-count').text(following);
        }
    });
});


$(`.head-post-token`).on('mouseenter', function(){
    var $this = $(this);
    $this.parent().parent().parent().find('.owner-infor').removeAttr('style');
    $this.parent().parent().parent().find('.owner-infor').attr('media', 'fadeup');
    $this.parent().parent().on('mouseleave', function(){
        $this.parent().parent().parent().find('.owner-infor').on('mouseleave', function(){
            $this.parent().parent().parent().find('.owner-infor').on('mouseenter', function(){
                $(this).attr('media', '').css({
                    opacity: 1,
                    top: "50px",
                    zIndex: 49,
                }).on('mouseleave', function(){
                    $(this).off('mouseenter');
                    $(this).removeAttr('style').attr('media', 'fadedown');
                    setTimeout(function(){
                        $this.parent().parent().parent().find('.owner-infor').css({
                            zIndex: "-1",
                    })}, 250);
                });
            });
        });
        $this.parent().parent().parent().find('.owner-infor').attr('media', 'fadedown');
        setTimeout(function(){
            $this.parent().parent().parent().find('.owner-infor').css({
                zIndex: "-1",
        })}, 250);
    });
}).on('click', function(){
    window.location = $(this).attr('href');
});
