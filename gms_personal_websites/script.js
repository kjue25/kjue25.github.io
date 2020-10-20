$(document).ready(function(){
    $("#submit").click(function(){
      //$("text").val("");
      if ($("#textBox").val() != "gryphons2022") {
        $("#error").text("Password Incorrect");
        $("#error").css("color","red");
      } else {
        $("#password").css("display","none");
        $("#projects").css("display","block");
      }
    });
});