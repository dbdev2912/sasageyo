var socket = io();
var pre_room;
var isSetPrev = false;
$('#file-chosing').click(function(){
    if($('.file-options').attr('drop')=="close"){
        $('.file-options').attr('drop', 'open');
        $(document).on('mouseup', function(){
            $('.file-options').attr('drop', 'close');
        });
    }else{
        $('.file-options').attr('drop', 'close');
    }
});

$('#close').click(function(){
    $('.preview-theme').hide();
    $('#preview').html('');
    $('#tmp-form').find('input').each(function(){
        $(this).val('');
    });
});

$('#img-input').click(function(){
    $('#img').click();
});

$('#img').change(function(){
    if($('#img').val()){

        $('.preview-theme').show();
        makePreview(this);
    }
});

function makePreview(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();

        reader.onload = function(e){
            // $('#preview').attr('src', e.target.result);
            var img = document.createElement('img');
            $(img).attr('src', `${e.target.result}`);
            $(img).attr('class', `media`);
            $(img).attr('type', `img`);
            $('#send-file').attr('ctype', 'img');
            $('#preview').html('');
            $('#preview').append(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$('#video-input').click(function(){
    $('#video').click();
});

$('#video').on('change', function(){
     if(isVideo($(this).val()) && this.files[0].size<26000000){
         var video = document.createElement('video');
         $(video).attr('src', `${URL.createObjectURL(this.files[0])}`);
         $(video).attr('controls', 'true');
         $(video).attr('autoplay', 'true');
         $(video).attr('class', `media`);
         $(video).attr('type', `video`);
         $('#send-file').attr('ctype', 'video');
         $('#preview').html('');
         $('#preview').append(video);
         $('.preview-theme').show();
    }
});


function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
    case 'm4v':
    case 'avi':
    case 'mp4':
    case 'mov':
    case 'mpg':
    case 'mpeg':
        return true;
    }
    return false;
}

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function makeMessage(position, type, content){
    var div = document.createElement('div');
    $(div).attr('class', `message-${position}`);
    switch(type){
        case "img":
            $(div).html(
                `
                    <img src="${content}" alt="">
                `
            );
            $('.messages-container').append(div);
            break;
        case "video":
            $(div).html(
                `
                    <video src="${content}" controls></video>
                `
            );
            $('.messages-container').append(div);
            break;
        case "text":
            $(div).html(
                `
                    <p class="message">${content}</p>
                `
            );
            $('.messages-container').append(div);
            break;

    }
}


$('#send-file').click(function(){
    var content = $('#preview').find('.media').attr('src');
    var type = $('#preview').find('.media').attr('type');

    var fd = new FormData();

    var file = $(`#${type}`)[0].files;

    fd.append('file', file[0]);
    fd.append('type', type);
    fd.append('from', `${ $('.session-credential-token').attr('user_id')}`);
    fd.append('to',  `${$('.messenger-user[state=active]').attr('token')}`);
    makeMessage("right", type, content);

    $('.messages-container').scrollTop($('.messages-container').find('div').eq($('.messages-container').find('div').length-1).offset().top + 1000000);

    $.ajax({
        url: "/saveMedia",
        type: "POST",
        data: fd,
        contentType: false,
        processData: false,
        success: function(resp){
            socket.emit('new-message-req', {
                                    from: `${ $('.session-credential-token').attr('user_id')}`,
                                    to: `${$('.messenger-user[state=active]').attr('token')}`,
                                    content: resp.content,
                                    type: resp.ctype,
            });
        }
    });
    $('#close').click();
});


$('#input').keyup(function(e){
    if(e.keyCode == 13){
        if($('#input').val()){

            makeMessage('right', 'text', `${$(this).val()}`);
            var content = $(this).val();
            $(this).val('');
            $('.messages-container').scrollTop($('.messages-container').find('div').eq($('.messages-container').find('div').length-1).offset().top + 1000000);

            socket.emit('new-message-req', {
                                    from: `${ $('.session-credential-token').attr('user_id')}`,
                                    to: `${$('.messenger-user[state=active]').attr('token')}`,
                                    content: content,
                                    type: "text",
            });
        }
    }
});

$('.messenger-user').click(function(){
    if(pre_room){
        socket.emit('leave-req', {user_id: pre_room, session: `${$('.session-credential-token').attr('user_id')}`});
    }
    if(!isSetPrev){
        pre_room = $(this).attr('token');
        isSetPrev = true;
    }
    $('.head-user-token').text($(this).find('.messenger-user-token').text());
    $('.head-user-img').find('img').attr('src', $(this).find('img').attr('src'));
    var user_id = $(this).attr('token');
    var session = $('.session-credential-token').attr('user_id');

    socket.emit('join-req', {user_id: user_id, session: session});

    $.ajax({
        url: "/getMessages",
        data:{
            user_1: user_id,
            user_2: session,
        },
        type: "POST",
        success: function(resp){
            var messages = resp.messages;
            $('.messages-container').html('');
            for(var i = 0; i< messages.length; i++){
                var position = "left";
                if(messages[i].sender == session){
                    position = "right";
                }
                makeMessage(position, messages[i].ctype, messages[i].content);
            }
        }
    });
});

socket.on('join-success', msg=>{
    $(`.messenger-user`).removeAttr('state');
    $(`.messenger-user[token="${msg.target}"]`).attr('state', 'active');
});

socket.on('new-message-arrived', msg=>{
    makeMessage('left', msg.ctype, msg.content);
    $('.messages-container').scrollTop($('.messages-container').find('div').eq($('.messages-container').find('div').length-1).offset().top + 1000000);
});
