$(document).ready(function(){
    $('.message .close')
    .on('click', function() {
    $(this)
        .closest('.message')
        .transition('fade')
    ;
    });
    $("#headerSearch").on("keydown", function(e){
        // if(e.which === 13){
        //     window.location.href("")
        //     $.ajax({
        //         type:"POST",
        //         url:"/search",
        //         data:{
        //             username: $("#headerSearch").val()
        //         }
        //     }); 
        // }
    }); 
});