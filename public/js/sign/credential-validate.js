

var err = document.createElement('div');
$(err).attr('class', 'tick-container').html(`
    <span class="tick-left"></span>
    <span class="tick-right"></span>
`);



$('#user').keyup(function(){
    var user_id = $('#user').val();
    var $this = $(this);
    if(user_id){

        $.ajax({
            url: '/validateUserId',
            type: 'POST',
            data: {
                user_id: user_id,
            },
            success: function(resp){
                if(!resp.exits){
                    $this.parent().find('.tick-container').remove();

                    var tick = document.createElement('div');
                    $(tick).attr('class', 'tick-container').html(`
                        <span class="tick-left"></span>
                        <span class="tick-right"></span>
                        `);
                        $this.after(tick);
                    }else{
                        $this.parent().find('.tick-container').remove();

                        var err = document.createElement('div');
                        $(err).attr('class', 'tick-container').html(`
                            <span class="err-left"></span>
                            <span class="err-right"></span>
                            `);
                            $this.after(err);
                        }
                    }
        });
    }
}).on('blur', function(){
    if(!$(this).val())
        $(this).parent().find('.tick-container').remove();
});


$('#token').keyup(function(){
    var user_token = $('#token').val();
    if(user_token){

    var $this = $(this);
    $.ajax({
        url: '/validateUserToken',
        type: 'POST',
        data: {
            user_token: user_token,
        },
        success: function(resp){
            if(!resp.exits){
                $this.parent().find('.tick-container').remove();

                var tick = document.createElement('div');
                $(tick).attr('class', 'tick-container').html(`
                    <span class="tick-left"></span>
                    <span class="tick-right"></span>
                    `);
                    $this.after(tick);
                }else{
                    $this.parent().find('.tick-container').remove();

                    var err = document.createElement('div');
                    $(err).attr('class', 'tick-container').html(`
                        <span class="err-left"></span>
                        <span class="err-right"></span>
                    `);
                    $this.after(err);
                }
            }
        });
    }
}).on('blur', function(){
    if(!$(this).val())
        $(this).parent().find('.tick-container').remove();
});
