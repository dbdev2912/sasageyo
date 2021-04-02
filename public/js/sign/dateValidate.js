$('#form').submit(function(e){
    e.preventDefault();

    $(this).find('input').each(function(){
        if(!$(this).val()){
            $(this).css({
                border: "2px solid red",
            }).removeAttr('valid');
        }else{
            var str = $(this).val();
            var valid = true;
            for(var i = 0; i < str.length;  i++){
                if(!validate(str[i])){
                    valid = false;
                }
            }
            if(valid){
                $(this).css({
                    border: "2px solid green",
                }).attr('valid', 'true');
            }else{
                $(this).css({
                    border: "2px solid red",
                }).removeAttr('valid');
            }
        }
    });
    var $valid = $('input[valid=true]');
    if($valid.length == 3){
        var date  = parseInt($valid.eq(0).val()),
            month = parseInt($valid.eq(1).val()),
            year  = parseInt($valid.eq(2).val());

        var valid = false;
        if(year%4==0){
            if(year%100 == 0 && year%400 == 0){
                if(month == 2 && date < 30 && date > 0){
                    valid = true;
                }else{
                    if((isin(month, [1, 3, 5, 7, 8, 10, 12]) && date < 32 && date > 0) ||
                        isin(month, [4, 6, 9, 11]) && date < 31 && date > 0){
                        valid = true;
                    }
                }
            }else{
                if(year%100 == 0 && year%400 != 0){
                    if(month == 2 && date < 29 && date > 0){
                        valid = true;
                    }else{
                        if((isin(month, [1, 3, 5, 7, 8, 10, 12]) && date < 32 && date > 0) ||
                        isin(month, [4, 6, 9, 11]) && date < 31 && date > 0){
                            valid = true;
                        }
                    }
                }
                if(year%100 != 0){
                    if(month == 2 && date < 30 && date > 0){
                        valid = true;
                    }else{
                        if((isin(month, [1, 3, 5, 7, 8, 10, 12]) && date < 32 && date > 0) ||
                            isin(month, [4, 6, 9, 11]) && date < 31 && date > 0){
                            valid = true;
                        }
                    }
                }
            }
        }else{
            if(month == 2 && date < 29 && date > 0){
                valid = true;
            }else{
                if((isin(month, [1, 3, 5, 7, 8, 10, 12]) && date < 32 && date > 0) ||
                    isin(month, [4, 6, 9, 11]) && date < 31 && date > 0){
                    valid = true;
                }
            }
        }
        if(valid){
            var $this = $(this);
            $.ajax({
                url: $this.attr('action'),
                data:{
                    date: date,
                    month: month,
                    year: year,
                },
                type: 'POST',
                dataType: "json",
                success: function(resp){
                    if(resp.success){
                        window.location = '/';
                    }
                }
            });
        }else{
            $(this).find('input').css({
                border: "red 2px solid",
            });
        }
    }
});


function validate(num){
    var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var found = false,
        count = 0;

    while(!found && count<nums.length){
        if(num == nums[count]){
            found = true;
        }
        count +=1;
    }
    return found;
}

function isin(num, list){
    for(var i = 0; i< list.length; i++){
        if(num == list[i]){
            return true;
        }
    }
    return false;
}
