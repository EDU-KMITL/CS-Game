var domain = "https://api.anto.io/channel/";
var token = "0Hn7DY4cibum3wefePTryjfvRqkfwBRDr3MFhUop/";
var deviceName = "mypi3/";

var lamp = function(action,number){
    var endPoint = (action == "open")? 1 : 0;
    if(number == "all"){
        for(var i = 1 ; i <= 4 ; i++){
            // $.get(domain+"get/"+token+""+deviceName+"led"+1,function (data) {
            //     console.log(data);
                $.get(domain+"set/"+token+""+deviceName+"led"+1+"/"+endPoint);
            // },"json");

        }
    } else {
        $.get(domain+"set/"+token+""+deviceName+"led"+number+"/"+endPoint);
    }
}