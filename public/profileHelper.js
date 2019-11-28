$(document).ready(function(){

    //console.log($("#subid").val());

    if($("#subid").val() == 1){
        $("#activeplan").text('Active subscription plan: Small');
    }
    else if($("#subid").val() == 2){
        $("#activeplan").text('Active subscription plan: Medium');
    }
    else if($("#subid").val() == 3){
        $("#activeplan").text('Active subscription plan: Enterprise');
    }
    else{
        $("#activeplan").text('Active subscription plan: None');
    }

    $("#subplan option").each(function(){
        //console.log('Option:',$(this).text());
        if($("#subid").val() == $(this).val()){
            //console.log('Match')
            $(this).attr("selected","selected");
        }
        else{
            //console.log('No match')
        }
    });

    $.post("/history", function(res){
        console.log('History response:',res);
        $.each(res,function(i,item){
            var $tr = $('<tr>').append(
                $('<td>').text(item.servicename),
                $('<td>').text(item.date)).appendTo('#historytable');
        });
    });

    $("#subplan").on('change', function(e){
        console.log('Sub plan change');
        var optionSelected = $('option:selected',this);
        // console.log('Option:',optionSelected);
        var newSub = $(this).val();
        console.log('New sub:',newSub);
        // $('.modal-body').html('New subscription plan: '+optionSelected.text());
        // $('.modal').modal('show');
        $.post("/change",{subid: newSub},function(res){
            console.log('Change response:',res);
            if(res == 'success'){
                console.log('Sub change successful, reloading');
                location.reload();
            }
            else{
                console.log('Sub change failed');
                alert('Subscription plan change failed: '+res);
            }
        });
    })

})