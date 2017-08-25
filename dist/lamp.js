var lamp = function(action,number){
    var endPoint = (action == "open")? 1 : 0;
    if(number == "all"){
        for(var i = 1 ; i <= 4 ; i++){
            $.get('https://api.anto.io/channel/set/0Hn7DY4cibum3wefePTryjfvRqkfwBRDr3MFhUop/mypi3/led'+i+"/"+endPoint);
        }
    } else {
        $.get('https://api.anto.io/channel/set/0Hn7DY4cibum3wefePTryjfvRqkfwBRDr3MFhUop/mypi3/led'+number+"/"+endPoint);
    }
}