$(function(){
    $('.policies').hide();
})

$('.post-img').css({
    width: `${$('._post').eq(0).width()}`,
});

$('.imgs-container').css({
    height: `${$('._post').eq(0).width()}`,
});

$('textarea').css({
    width: `${$('._post').eq(0).width()-50}`,
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
    $('._post').eq(1).css({
        height: `${$('._post').eq(0).height()}px`,
    });
});


$(function(){
    $('#suggest-users').html('');
    $.ajax({
        url: `/getSimilars`,
        type: "POST",
        data: {},
        success: function(resp){
            var similars = resp.similars;
            for(var i =0; i<similars.length; i++){
                var div = document.createElement('div');
                $(div).attr('class', 'user');
                $(div).attr('href', `u/${similars[i].user_token}`);
                $(div).html(`
                    <div class="user-img">
                        <img src="${similars[i].avatar}" alt="">
                    </div>
                    <div class="user-name">
                        <span>${similars[i].user_token}</span>
                        <p>Gợi ý cho bạn</p>
                    </div>
                    <div class="psedou-btn-container">
                        <button class="psedou-btn" role="follow" token="${similars[i].user_token}">Theo dõi</button>
                    </div>
                `);
                $('#suggest-users').prepend(div);
            }
            $('.user img, .user span').click(function(){
                window.location = $(this).parent().parent().attr('href');
            });

            $('button[role="follow"]').click(function(){
                socket.emit('someone-has-followed-you', {user_token: $(this).attr('token'), user: $('.self-name span').eq(0).attr('id')});
            });
        }
    });
});
