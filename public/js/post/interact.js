$('._post-comments').each(function(){
    var id = $(this).parent().find('input[role=comment]').attr('post_id');
    var position = $(this).attr('position');
    var $this = $(this);
    $.ajax({
        url: '/comments',
        type: "POST",
        data:{
            post_id: id,
            position: position,

        },
        success: function(resp){
            $this.parent().find('.total-cmts .cmts').text(resp.total);
            var cmts = resp.cmts;
            for(var i = 0; i < cmts.length; i++){
                var p = document.createElement('p');
                $(p).attr('class', 'content').html(`
                    <span class="owner-ident">${cmts[i].user_token}</span> ${cmts[i].content}
                `);
                $this.find('.more-comments').parent().before($(p));
            }
            $this.attr('position', `${resp.new_pos}`);
        }
    });
});

function moreCmts(id, position){
    var $this = $(`input[post_id="${id}"]`).parent().parent().find('._post-comments');
    $.ajax({
        url: '/comments',
        type: "POST",
        data:{
            post_id: id,
            position: position,

        },
        success: function(resp){
            $this.parent().find('.total-cmts .cmts').text(resp.total);
            var cmts = resp.cmts;
            for(var i = 0; i < cmts.length; i++){
                var p = document.createElement('p');
                $(p).attr('class', 'content').html(`
                    <span class="owner-ident">${cmts[i].user_token}</span> ${cmts[i].content}
                `);
                $this.find('.more-comments').parent().before($(p));
            }
            $this.attr('position', `${resp.new_pos}`);
        }
    });
};


$('.more-comments').click(function(){
    var id = $(this).parent().parent().parent().find('input[role=comment]').attr('post_id');
    var position = $(this).parent().parent().attr('position');
    console.log( id + '\t' + position );
    moreCmts(id, position);
});

var socket = io();

socket.on(`notif`, msg=>{
    var li = document.createElement('li');
        $(li).html(`
        <img src="${msg.src}" class="notify-img">
        <a class="drop-link" href="${msg.url}"><span>${msg.user_token}</span> Vừa thích một bài viết của bạn</a>
    `).attr('class', "dropdown-item notify-mess");
    $('.notifi ul').prepend($(li));
    $('#notify').find('svg').attr('fill', '#ff0000');
    $('#notify').click(function(){
        $('#notify').find('svg').attr('fill', '#000000');
    });
});


socket.on(`someone-has-cmtd-on-your-post`, msg=>{
    // console.log(msg);
    var li = document.createElement('li');
        $(li).html(`
        <img src="${msg.src}" class="notify-img">
        <a class="drop-link" href="${msg.url}"><span>${msg.user_token}</span> Vừa bình luận một bài viết của bạn</a>
    `).attr('class', "dropdown-item notify-mess");
    $('.notifi ul').prepend($(li));
    $('#notify').find('svg').attr('fill', '#ff0000');
    $('#notify').click(function(){
        $('#notify').find('svg').attr('fill', '#000000');
    });
});

socket.on('new-mess', msg=>{

    var p = document.createElement('p');
    $(p).attr('class', 'content').html(`
        <span class="owner-ident">${msg.user_token}</span> ${msg.cmt}
    `);
    $(`input[post_id="${msg.post_id}"]`).parent().parent().find('.more-comments').parent().before($(p));

});


$('.like').click(function(){
    var post_id = $(this).attr('post_id');
    var owner = $(this).attr('owner');
    // console.log('click');
    if($(this).attr('liked')=="0"){
        $(this).attr('liked', "1");
        $(this).html(`
                <svg aria-label="Bỏ thích" fill="#ed4956" height="24" viewBox="0 0 48 48" width="24">
                    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                </svg>

            `);
        socket.emit('someone-likes-your-post', {post_id: post_id, user_id: owner});
    }else{
        $(this).attr('liked', "0");
        $(this).html(`
            <svg aria-label="Thích" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                <path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
            </svg>
        `);
        socket.emit('someone-dislikes-your-post', {post_id: post_id});
    }
});

$('input[role=comment]').keyup(function(e){
    if(e.keyCode == 13 && $(this).val()){
        var cmt = $(this).val();

        var id = $(this).attr('post_id');
        var owner = $(this).attr('owner');
        $(this).val('');
        socket.emit('someone-cmtd-on-your-post', {post_id: id, cmt: cmt, user_id: owner});
    }
});

$('#follow').click(function(){
    socket.emit('someone-has-followed-you', {user_token: $(this).attr('token'), user: $(this).attr('self')});
});

socket.on('someone-has-followed-you', msg=>{
    var li = document.createElement('li');
        $(li).html(`
        <img src="${msg.src}" class="notify-img">
        <a class="drop-link" href="${msg.url}"><span>${msg.r_user_token}</span> Vừa theo dõi bạn.</a>
    `).attr('class', "dropdown-item notify-mess");
    $('.notifi ul').prepend($(li));
    $('#notify').find('svg').attr('fill', '#ff0000');
    $('#notify').click(function(){
        $('#notify').find('svg').attr('fill', '#000000');
    });
});

socket.on('follow-success', msg=>{
    $(`button[token="${msg.token}"]`).text('Đã theo dõi').attr('disabled', '');
});
