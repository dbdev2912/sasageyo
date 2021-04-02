$(function(){
    $('.policies').hide();
});


$('.next').click(function(){
    var $head = $(this).parent().find('div[role=head]');
    var position = parseInt($head.attr('position'));
    var limit = $(this).parent().find('.post-img').length;


    position +=1;
    if(position > limit-1){
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
        position = $(this).parent().find('.post-img').length-1;
    }

    var marginLeft = -position*100;

    $head.animate({
        marginLeft: `${marginLeft}%`,
    }, 300);
    $(this).parent().find('div[role=head]').attr('position', `${position}`);

});

$('._post-body').on('mouseenter', function(){
    $(this).find('button').fadeIn(500);
    $(this).on('mouseleave', function(){
        $(this).find('button').fadeOut(200);
    });
});


$(window).resize(function(){
    $('.post-img').css({
        width: `${$('._post').eq(0).width()}`,
    });
    $('.imgs-container').css({
        height: `${$('._post').eq(0).width()}`,
    });
});


function readURL(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();

        reader.onload = function(e){
            // $('#preview').attr('src', e.target.result);
            $('#preview').remove();
            var div = document.createElement('div');
            div.setAttribute('class', '_post-img');
            if($('._post-img').length==1){
                div.setAttribute('position', '0');
                div.setAttribute('role', 'head');
            }
            div.innerHTML = `
            <button name="file${nth-1}" class="_post-close">
                <svg fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                    <path clip-rule="evenodd" d="M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z"></path>
                </svg>
            </button>
            <div class="post-img" style="
                background: url('${e.target.result}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 100%;
                width: ${$('._post').eq(0).width()}px !important;
            ">
            </div>
            `;
            $('#add-img-theme').before(div);
            $('._post-close').click(function(){
                var name = $(this).attr('name');
                $(this).parent().remove();
                $(`input[name="${name}"]`).remove();
            });
        }
        reader.readAsDataURL(input.files[0]);
    }
}


var nth = 0;

$('.add-toggle').click(function(){
    var input = document.createElement('input');
    var name = `file${nth}`;
        input.setAttribute('name', `file${nth}`);
        nth +=1;
        input.setAttribute('type', 'file');

    $('#hidden-form').append(input);

    $(`#hidden-form input[name="${name}"]`).click();
    $(`#hidden-form input[name="${name}"]`).change(function(){
        readURL(this);
    });
});


$('#post').click(function(){
    var content = $('textarea[name="content"]').val();

    var textarea = document.createElement(`textarea`);
        textarea.setAttribute('name', 'content');
        textarea.setAttribute('id', 'tmp-content');
    $('#hidden-form').append(textarea);
    $('#tmp-content').val(content);
    $('#hidden-form').submit();
});



$(window).resize(function(){
    $('.post-img').css({
        width: `${$('._post').eq(0).width()}`,
    });
    $('textarea').css({
        width: `${$('._post').eq(0).width()-50}`,
    });
});
