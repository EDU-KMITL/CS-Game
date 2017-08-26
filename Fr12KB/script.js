var setups = [];
var teams = [];


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

var message = function (mg, type) {
    $('#' + type).clone().text(mg).insertBefore($('#' + type)).slideDown();
}

var success = function (mg) {
    message(mg, "success");
}

var error = function (mg) {
    message(mg, "error");
}


var updateDb = function (url, value) {
    try {
        firebase.database().ref(url).set(value);
        success("อัพเดทฐานข้อมูลแล้ว!")
    } catch (err) {
        error("อัพเดทฐานข้อมูลไม่สำเร็จ");
        console.log(err);
    }

}

var removeDb = function (url) {
    try {
        firebase.database().ref(url).remove();
        success("ลบข้อมูลแล้ว!")
    } catch (err) {
        error("ลบข้อมูลไม่สำเร็จ");
        console.log(err);
    }
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
                "<input onchange='updateDb(\"Setups/Puzzles/" + i + "/Answer\",$(this).val())' class='puzzle-input' type='text' value='" + item.Answer + "'/>" +
                "</th>" +
                "<th width='50'>" +
                "<div align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Setups/Puzzles/" + i + "\")' class='btn btn-danger btn-xs full-width squire-border'>ลบ</button></div>" +
                "</th>" +
                "</tr>";
            var countJ = 0;
            if (item.ARGens != null) {
                item.ARGens.map(function (argen, j) {
                    countJ++;
                    html += "<tr>" +
                        "<td colspan='2'><textarea onchange='updateDb(\"Setups/Puzzles/" + i + "/ARGens/" + j + "\",$(this).val())' class='puzzle-input' rows='1'>" + argen + "</textarea></td>" +
                        "<td align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Setups/Puzzles/" + i + "/ARGens/" + j + "\")' class='btn btn-warning btn-xs full-width squire-border'>x</button></td>" +
                        "</tr>";
                });
            }
            html += "<tr>" +
                "<td colspan='3'><textarea onchange='updateDb(\"Setups/Puzzles/" + i + "/ARGens/" + (countJ) + "\",$(this).val())' class='puzzle-input' rows='1'></textarea></td>" +
                "</tr>";
            html += "</table>";
        });
        if ($("#puzzle-container").html() != html) {
            $("#puzzle-container").html(html);
        }
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
                "<input onchange='updateDb(\"Setups/Bombs/" + i + "\",$(this).val())' class='puzzle-input' type='text' value='" + item + "'/>" +
                "</th>" +
                "<th width='50'>" +
                "<div align='center'><button onclick='if(confirm(\"คุณต้องการลบหรือไม่?\")) removeDb(\"Setups/Bombs/" + i + "\")' class='btn btn-danger btn-xs full-width squire-border'>ลบ</button></div>" +
                "</th>" +
                "</tr>";
            html += "";
        });
        if ($("#puzzle-bomb-container").html() != html) {
            $("#puzzle-bomb-container").html(html);
        }
    } else {
        setups.Bombs = [];
        $("#puzzle-bomb-container").html("");
    }


}

var checkTeams = function () {
    var html = "";
    if (teams != null) {
        $.each(teams, function (index, items) {
            var puzzleAns = (setups.Puzzles[items.State.Puzzle] != null) ? setups.Puzzles[items.State.Puzzle].Answer : "Not Ready";
            var led = (items.State != null) ? items.State.Led : null;
            html += "<div class=\"team-detail led-selected-" + led + "\">" +
                "Name: <b>" + index + "</b>, " +

                "Color:";
            for (var i = 1; i <= 4; i++) {
                html += "<button class=\"led-btn led-" + i + "\" onclick='updateDb(\"Teams/" + index + "/State/Led\"," + i + ");'>";
                if (led == i)
                    html +=
                        "<span class=\"glyphicon glyphicon-let glyphicon-ok\"></span>";
                html += "</button>";
            }

            html += "   Puzzle Answer: " + puzzleAns + ", " +
                "Member(" + (Object.keys(items).length-1) + "): ";
            $.each(items,function(jindex,com){

                if(jindex != "State") {
                    var userPass = (com.Checkpoint1.password != null && com.Checkpoint1.password != "")? "["+com.Checkpoint1.password+"]" : "";
                    html += jindex + userPass + ", ";
                }
            });
            html +=
                "</div>" +
                "</div>";
        });
    }
    if ($("#teams-setup").html() != html) {
        $("#teams-setup").html(html);
    }
}

var removeTeams = function() {
    removeDb('Teams');
    lamp("close","all");
    firebase.database().ref("/Setups/Game/IsPlaying").set(false);
}

var resetValues = function () {
    lamp("close","all");
    var values = {};
    if (teams != null && teams.length != 0) {
        $.each(teams, function (i, team) {
            values[i] = team;
            var led = (team.State != null) ? team.State.Led : null;
            $.each(team, function (j, com) {
                var dateReset = (j == "State") ?
                    {
                        Checkpoint4: false,
                        IsPlaying: false,
                        Place: 0,
                        Puzzle: "",
                        Led: led,
                    } :
                    {
                        Status: false,
                        Checkpoint1: {
                            password: "",
                            Status: false
                        },
                        Checkpoint2: {
                            Count: 0,
                            Status: false
                        },
                        Checkpoint3: {
                            image: "",
                            Status: false
                        }
                    };
                values[i][j] = dateReset;
            });
        });
        updateDb('/Teams', values);
        firebase.database().ref("/Setups/Game/IsPlaying").set(false);
    }

}

var uniqueRandoms = [];

function makeUniqueRandom(numRandoms) {

    // refill the array if needed
    if (!uniqueRandoms.length) {
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandoms.push(i);
        }
    }
    var index = Math.floor(Math.random() * uniqueRandoms.length);
    var val = uniqueRandoms[index];

    // now remove that value from the array
    uniqueRandoms.splice(index, 1);

    return val;

}

var uniqueRandomsPassword = [];

function makeUniqueRandomPassword(numRandoms) {

    // refill the array if needed
    if (!uniqueRandomsPassword.length) {
        for (var i = 0; i < numRandoms; i++) {
            uniqueRandomsPassword.push(i);
        }
    }
    var index = Math.floor(Math.random() * uniqueRandomsPassword.length);
    var val = uniqueRandomsPassword[index];

    // now remove that value from the array
    uniqueRandomsPassword.splice(index, 1);

    return val;

}

function makePassword() {
    var result = [];
    for (var j = 0; j < 4; j++) {
        result.push(makeUniqueRandomPassword(4) + 1);
    }
    return result.join("");
}

var startGame = function () {
    var values = {};
    var puzzleCount = setups.Puzzles.length;
    var puzzleSelected = [];
    var isValid = true;

    if (teams != null && teams.length != 0) {
        if (teams.length > puzzleCount) {
            alert("รหัสปริศนาไม่เพียงพอต่อกลุ่มผู้เล่น");
            isValid = false;
            return false;
        } else {
            $.each(teams, function (i, team) {
                values[i] = team;

                if(team.State == null){
                    alert("กรุณาเลือกสีของทีมให้เรียบร้อย");
                    isValid = false;
                    return false;
                }
                var comCount = Object.keys(team).length;
                var randomUniqPuzzle = function () {
                    var rannnnn = Math.floor(Math.random() * puzzleCount);
                    if (puzzleSelected.indexOf(rannnnn) > -1) {
                        return randomUniqPuzzle();
                    } else {
                        puzzleSelected.push(rannnnn);
                        return rannnnn;
                    }
                }
                var puzzleNumber = randomUniqPuzzle();


                var bombs = setups.Bombs;

                var bombCount = bombs.length;

                var argenCount = setups.Puzzles[puzzleNumber].ARGens.length;

                var argens = setups.Puzzles[puzzleNumber].ARGens;


                if (comCount < argenCount) {
                    alert("สมาชิกในกลุ่มน้อยเกินกว่ารหัสภาพ AR Gen กรุณาเพิ่มสมาชิกในกลุ่มให้มากกว่า " + argenCount + " คน");
                    isValid = false;
                    return false;
                } else if (comCount > argenCount) {
                    for (var x = 0; x < comCount - argenCount; x++) {
                        argens.push(bombs[makeUniqueRandom(bombCount)]);
                    }
                }

                $.each(team, function (j, com) {
                    var dateReset = (j == "State") ?
                        {
                            Checkpoint4: false,
                            IsPlaying: true,
                            Place: 0,
                            Puzzle: puzzleNumber,
                            Led: (team.State != null) ? team.State.Led : 0
                        } :
                        {
                            Status: true,
                            Checkpoint1: {
                                password: makePassword(),
                                Status: false
                            },
                            Checkpoint2: {
                                Count: 0,
                                Status: false
                            },
                            Checkpoint3: {
                                Image: argens.pop(),
                                Status: false
                            }
                        };
                    values[i][j] = dateReset;
                });
            });
            if (isValid) {
                firebase.database().ref("/Teams").set(values);
                firebase.database().ref("/Setups/Game/IsPlaying").set(true);
            }
            ;
        }
    } else {
        alert("กรุณาเพิ่มทีมหรือเพิ่มปริศนาก่อน");
    }
}


$(document).ready(function (e) {
    $('.message-text').hide();
    var db = firebase.database().ref("/");
    db.on('value', function (snapshot) {
        data = snapshot.val();
        setups = data.Setups;
        teams = data.Teams;
        checkPuzzle();
        checkTeams();
        if(setups.Game.IsPlaying){
            $('#startGame').text("Playing...").attr("disabled",true);
        } else {
            $('#startGame').text("Start Game").removeAttr("disabled");
        }
    });

});
