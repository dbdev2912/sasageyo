var socket = io();

$('button[role="follow"]').click(function(){
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
