var dbInfo = null;
var teams = null;

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

var clearState = function(){
    $('#winner').slideUp();
}

var dbRef = function () {
    var db = firebase.database().ref("/");
    db.on('value', function (snapshot) {
        var valueSnapshot = snapshot.val();
        dbInfo = valueSnapshot;
        if(dbInfo.Setups.Game.IsPlaying == false){
            clearState();
        }
        if (valueSnapshot.Teams != null) {
            teams = valueSnapshot.Teams;
            var html = "";
            $.each(teams, function (index, team) {
                    var memberLength = 0;
                    $.each(team, function (jindex, com) {
                        if (jindex != "State") {
                            memberLength++;
                        }
                    });

                    html += "<div id='team-" + index + "' class=\"col-sm-3\">" +
                        "<div class=\"panel panel-info\">";

                    if (team.State != null && team.State.Checkpoint4) {
                        var placeText = "Loser";
                        switch (team.State.Place) {
                            case 1 :
                                placeText = "The Winner!!";
                                break;
                            case 2 :
                                placeText = "2nd";
                                break;
                            default:
                                placeText = teamState.State.Place + "th";
                        }
                        $('#winner').html("<h1> Team \"" + index + "\" is " + placeText + "</h1>").slideDown();
                        setTimeout(function(){
                            $("#team-" + index).hide('slow');
                        },300);
                    }

                    html +=
                        "<div class=\"panel-heading\">" +
                        "<h3 class=\"panel-title\">Team: " + index + " [ " + memberLength + " ]</h3>" +
                        "</div>" +
                        "<table class=\"table\">";
                    if (memberLength != 0) {
                        $.each(team, function (jindex, com) {
                            if (jindex != "State") {
                                var checkpoint = "Waiting...";
                                if (com.Checkpoint3.Status) {
                                    checkpoint = "Success";
                                } else if (com.Checkpoint2.Status) {
                                    checkpoint = "<img style='height: 1.5em;' src='" + com.Checkpoint3.Image + "'/>";
                                } else if (com.Checkpoint1.Status) {
                                    checkpoint = "<div class='clicker-status' style='width: " + com.Checkpoint2.Count + "%;'>" + com.Checkpoint2.Count + "%</div>";
                                } else if (com.Status) {
                                    checkpoint = "Password Screen";
                                }

                                if (jindex != "State") {
                                    html += "<tr>" +
                                        "<td>" +
                                        jindex +
                                        "</td>" +
                                        "<td>" +
                                        checkpoint +
                                        "</td>" +
                                        "</tr>";
                                }
                            }
                        });
                    }
                    html +=
                        "</table>";


                    html +=
                        "</div>" +
                        "</div>";
                }
            );

            if ($('#teams-container').html() != html) {
                $('#teams-container').html(html);
            }
        } else {
            $('#teams-container').html("<h1 style='color: #ffffff;'>No Teams</h1>");
            clearState();
        }
    });
}

$(document).ready(function () {
    dbRef();
});