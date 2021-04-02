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

var drop = false;

function showPost(id){
    history.pushState(null, null, `/p/${id}`);

    $('#_post').html(' ');
    $('#comments').html(' ');


    $('.next-post').fadeIn(1);
    $('.prev-post').fadeIn(1);

    var $this = $(`.theme[post_id="${id}"]`).parent();
    if($this.attr('pos')=='end'){
        $('.next-post').hide();
    }
    if($this.attr('pos')=='start'){
        $('.prev-post').hide();
    }

    $.ajax({
        url: '/getPostInfor',
        type: "POST",
        data: {
            post_id: id,
        },
        success: function(resp){
            var post = resp.post;

            var div = document.createElement('div');
                div.setAttribute('class', '_post');
                div.innerHTML = `
                <div class="_post-header">
                    <div class="head-div owner-img">
                        <img src="${post.postOwner.avatar}" alt="">
                    </div>
                    <div class="head-div owner-name">
                        <span id="owner-token">${post.postOwner.user_token}</span>
                    </div>
                    <div class="head-div switch">
                        <span class="switch-notation">...</span>
                    </div>
                </div>
                <div class="_post-body">
                    <div class="owner-utils">
                        <span class="bridge owner-util-bridge"></span>
                        <div class="owner-util">
                            <span class="owner-util-label" id="to-post-page">Đi đến trang bài viết</span>
                        </div>
                        <div class="owner-util">
                            <span class="owner-util-label">Sao chép liên kết</span>
                        </div>
                        <div class="owner-util">
                            <span class="owner-util-label">Nhúng</span>
                        </div>
                        <div class="owner-util" id="delete-report">
                            <span class="owner-util-label">Báo xấu</span>
                        </div>
                    </div>
                    <button class="next">^</button>
                    <button class="prev">^</button>
                    <div class="imgs-container">
                        <div class="_post-img" role="head" position="0">
                            <img class="post-img" src="${post.start_url}" alt="">
                        </div>
                    </div>
                </div>
                <div class="_post-utils">
                    <div class="util like" liked="1" owner="${post.postOwner.user_id}" post_id=${id}>
                        <svg aria-label="Bỏ thích" fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                    </div>
                    <div class="util like" liked="0" owner="${post.postOwner.user_id}" post_id=${id}>
                        <svg aria-label="Thích" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                            <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                        </svg>
                    </div>
                    <!-- <div class="util comment">
                        <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                            <path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path>
                        </svg>
                    </div> -->
                    <div class="util share">
                        <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                            <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path>
                        </svg>
                    </div>
                    <div class="util saved">
                        <svg  fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                            <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"></path>
                        </svg>
                    </div>
                </div>
            `;
            $('#_post').append(div);
            for(var i = 0; i<post.url.length; i++){
                var div = document.createElement('div');
                    div.setAttribute('class', '_post-img');
                    div.innerHTML = `
                        <img class="post-img" src="${post.url[i]}" alt="">
                    `;
                $('.imgs-container').append(div);
            }
            $('.dark-theme').css({
                display: "flex",
            });

            $('._hidden-post-close').click(function(){
                $('.dark-theme').css({
                    display: "none",
                });
                history.pushState(null, null, `/u/${$('#owner-token').text()}`);
            });

            var div = document.createElement('div');
                div.setAttribute('class', '_post');
                div.innerHTML = `
                <div class="_post-content">
                    <span class="total-like"><span class="likes"></span> lượt thích</span>
                    <p class="content"><span class="owner-ident">${post.postOwner.user_token} </span> ${post.content}</p>
                    <span class="total-cmts">Tất cả <span class="cmts"></span> bình luận</span>
                </div>
                <div class="_post-comments saperate" style="height: 80%" position="0">
                    <!-- <p class="content"><span class="owner-ident">minupython</span> From minu with love</p> -->
                    <p style="text-align: center">
                        <button class="psedou-btn more-comments">Xem thêm 20 bình luận</button>
                    </p>
                </div>
                <div class="make-comment">
                    <input type="text" owner="${post.postOwner.user_id}" post_id="${id}" role="comment" placeholder="Thêm bình luận ..">
                    <button class="psedou-btn">Đăng</button>
                </div>
                <script id="tmpSrc" src="/js/post/interact.js"></script>
            `;
            $('#comments').append(div);



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


            $('._post').each(function(){
                var id = $(this).find('div[liked="1"]').attr('post_id');
                var $this = $(this);
                // console.log(id);
                $.ajax({
                    url: '/likesAndLiked',
                    type: "POST",
                    data:{
                        post_id: id,
                    },
                    success: function(resp){
                        if(resp.liked){
                            $this.find('div[liked="0"]').remove();
                        }else{
                            $this.find('div[liked="1"]').remove();
                        }
                        if(resp.likes){
                            $this.parent().next().find('.total-like .likes').text(resp.likes);

                        }else{
                            $this.parent().next().find('.total-like').html('Chưa có lượt thích nào');
                        }
                    }
                });
            });

            $('._post-body').on('mouseenter', function(){
                $(this).find('button').fadeIn(500);
                $(this).on('mouseleave', function(){
                    $(this).find('button').fadeOut(200);
                });
            });


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
            $('._post').eq(1).css({
                height: `${$('._post').eq(0).height()}px`,
            });

            $(`.saperate`).css({
                height: `${$('._post').eq(0).height() * 60/100}px`,
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
                $(`.saperate`).css({
                    height: `${$('._post').eq(0).height() * 60/100}px`,
                });
            });

            $('.switch-notation').click(function(){
                if(!drop){
                    drop = true;
                    $('.owner-utils').css({
                        display: "block",
                    });

                }else{
                    drop = false;
                    $('.owner-utils').css({
                        display: "none",
                    });
                }

                $('.owner-utils').on('mouseenter', function(){
                    $('.next').hide();
                    $('.prev').hide();
                });

                $('#delete-post').on('click', function(){
                    $.ajax({
                        url: '/delete-post',
                        type: "POST",
                        data:{
                            post_id: id,
                        },
                        success: function(resp){
                            if(resp.succ){

                                $(`div[post_id="${id}"]`).parent().remove();
                                $('._hidden-post-close').click();
                            }
                        }
                    });
                });

                $('#to-post-page').click(function(){
                    window.location = `/p/${id}`;
                });
            });
        }
    });
};

var $this;

$('.theme').click(function(){
    var id = $(this).attr('post_id');
    showPost(id);
    $('#counter').attr('current', id);
});

$('.next-post').click(function(){
    var current = $('#counter').attr('current');
    // console.log(current);

    var $next = $(`.theme[post_id="${current}"]`).parent().next();
    if($next){
        var id = $next.find('.theme').eq(0).attr('post_id');
        showPost(id);
        $('#counter').attr('current', id);
    }
});

$('.prev-post').click(function(){
    var current = $('#counter').attr('current');
    // console.log(current);

    var $next = $(`.theme[post_id="${current}"]`).parent().prev();
    if($next){
        var id = $next.find('.theme').eq(0).attr('post_id');
        showPost(id);
        $('#counter').attr('current', id);
    }
});


$('.post').each(function(){
    var id = $(this).find('.theme').attr('post_id');
    var $this = $(this);
    // console.log(id);
    $.ajax({
        url: '/likesAndLiked',
        type: "POST",
        data:{
            post_id: id,
        },
        success: function(resp){
            $this.find('.likes').text(resp.likes);
        }
    });
});
