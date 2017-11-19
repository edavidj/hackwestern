$(document).ready(function(){
    $('.message .close')
    .on('click', function() {
    $(this)
        .closest('.message')
        .transition('fade')
    ;
    });
    $("#searchBar").on("keypress", function(e){
        if(e.which === 13){
            $.ajax({
                type:"GET",
                url:"/search",
                data: {
                    username: $("#searchBar").val()
                }
            })
        }
    })
});