$(document).ready(function(){
    $("#alertMessage").hide();
    //document.getElementsByClassName("alert").disabled = true;
    $("#submitBtn").click(function(event){
        event.preventDefault();
        console.log("Inside Check");
        var urlInput = $("#URLvalue").val();
        var res = urlInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if(res == null) {
            $("#alertMessage").show();
            $("#alertMessage").html("Please enter a valid URL.");
        } else {
            $('form').submit();
        }
    });
});
