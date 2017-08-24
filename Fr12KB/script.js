var setups = [];


//Firebase Config
var config = {
    apiKey: "AIzaSyBPFEBqTDO9TkCabqgZz_lM3D3FwRjt7Ls",
    authDomain: "educational-community-kmitl.firebaseapp.com",
    databaseURL: "https://educational-community-kmitl.firebaseio.com",
    projectId: "educational-community-kmitl",
    storageBucket: "educational-community-kmitl.appspot.com",
    messagingSenderId: "642567061469"
};
firebase.initializeApp(config);

var updateDb = function (url, value) {
    firebase.database().ref("Setups/" + url).set(value);
}

var removeDb = function (url) {
    firebase.database().ref("Setups/" + url).remove();
}

var checkPuzzle = function () {
    var html = "";
    if (setups.Puzzles != null) {
        html = "";
        setups.Puzzles.map(function (item, i) {
            html += "<table border=\"1\" class='puzzle-table tabel' align='center'>" +
                "<tr>" +
                "<th width='100'>" +
                "<div >Answer: </div>" +
                "</th>" +
                "<th>" +
                "<input onchange='updateDb(\"Puzzles/"+i+"/Answer\",$(this).val())' class='puzzle-input' type='text' value='" + item.Answer + "'/>" +
                "</th>" +
                "<th width='50'>" +
                "<div align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Puzzles/"+i+"\")' class='btn btn-danger btn-xs full-width squire-border'>ลบ</button></div>" +
                "</th>" +
                "</tr>";
            var countJ = 0;
            if(item.ARGens != null){
                item.ARGens.map(function (argen, j) {
                    countJ++;
                    html += "<tr>" +
                        "<td colspan='2'><textarea onchange='updateDb(\"Puzzles/"+i+"/ARGens/"+j+"\",$(this).val())' class='puzzle-input' rows='1'>" + argen + "</textarea></td>" +
                        "<td align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Puzzles/"+i+"/ARGens/"+j+"\")' class='btn btn-warning btn-xs full-width squire-border'>x</button></td>" +
                        "</tr>";
                });
            }
            html += "<tr>" +
                "<td colspan='3'><textarea onchange='updateDb(\"Puzzles/"+i+"/ARGens/"+(countJ)+"\",$(this).val())' class='puzzle-input' rows='1'></textarea></td>" +
                "</tr>";
            html += "</table>";
        });
        $("#puzzle-container").html(html);
    } else {
        setups.Puzzles = [];
        $("#puzzle-container").html("");
    }

    if (setups.Bombs != null) {
        html = "";
        setups.Bombs.map(function (item, i) {
            html += "" +
                "<tr>" +
                "<th>" +
                "<input class='puzzle-input' type='text' value='" + item + "'/>" +
                "</th>" +
                "<th width='50'>" +
                "<div align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Bombs/"+i+"\")' class='btn btn-danger btn-xs full-width squire-border'>ลบ</button></div>" +
                "</th>" +
                "</tr>";
            html += "";
        });
        $("#puzzle-bomb-container").html(html);
    } else {
        setups.Bombs = [];
        $("#puzzle-bomb-container").html("");
    }


}

$(document).ready(function (e) {
    var db = firebase.database().ref("Setups");
    db.on('value', function (snapshot) {
        setups = snapshot.val();
        checkPuzzle();
    });
});
