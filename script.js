//Declare variables
var passAns = null,
    passKey = [],
    computerName = null,
    teamName = null,
    isSetup = false,
    currentPage = null,
    clickerCount = 0,
    clickerDown = false,
    state = {};


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

var changePage = function (page) {
    if (window.location.hash != page || window.location.hash == "") {
        window.location.hash = page;
        currentPage = page;
        $('.screen').fadeOut();
        $(page).fadeIn();
    } else {
        $(page).show();
    }

}

//Setup Screen
function onlyAlphabets(t) {
    var regex = /[a-zA-Z]|[0-9]/;
    return regex.test(t);
}

$("#setup").bind('click', function () {
    $('#setup-danger').text('');
    computerName = $('#computerName').val().replace();
    teamName = $('#teamName').val().replace();
    $('#computerName').val(computerName);
    $('#teamName').val(teamName);
    if (computerName != "" && teamName != "" && onlyAlphabets(computerName) && onlyAlphabets(teamName)) {
        firebase.database().ref("Teams/" + teamName + "/" + computerName).set(state);
        dbRef();
        isSetup = true;
        $('.user').find("div").html("Team: "+teamName+", Computer: "+computerName).fadeIn();
        changePage("#checkpoint1");
    } else {
        $('#setup-danger').text('กรุณาระบุข้อมูลให้ถูกต้อง');
    }
});

//Password Screen
var passKeyUp = function (key) {
    var char = String.fromCharCode(key);
    passKey.push(char);
    $('#pass-box-' + passKey.length).text(char);
}

var clearPass = function () {
    passKey = [];
    for (var i = 1; i <= 4; i++) {
        $('#pass-box-' + i).text("");
    }
}

var clickDown = function () {
    setInterval(function () {
        if (clickerCount > 0 && clickerCount < 100) {
            clickerCount--;
            $('#clicker-count').css('height', clickerCount + "%");
            updateDb("Checkpoint2/Count", clickerCount);
        }
    }, 300)
}

var updateDb = function (url, value) {
    firebase.database().ref("Teams/" + teamName + "/" + computerName + "/" + url).set(value);
}

var dbRef = function () {
    var db = firebase.database().ref("Teams/" + teamName + "/" + computerName);
    db.on('value', function (snapshot) {
        state = snapshot.val();
        if (state == null) {
            computerName = null;
            teamName = null;
            isSetup = false;
            clearState();
        } else if (state.Status) {
            passAns = state.Checkpoint1.password;
            $('#wait').slideUp();
            $('#ready').slideDown();
        } else {
            $('#wait').slideDown();
            $('#ready').slideUp();
            clearState();
        }
    });
}


//Clear State

var clearState = function () {
    if (!isSetup) {
        changePage("#setup-box");
    } else if (currentPage != "#checkpoint1" && currentPage != "#setup-box" && currentPage != "") {
        changePage("#checkpoint1");
    }


    passKey = [];
    clickerCount = 0;
    clickerDown = false;
    state = {
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
    passAns = null;

    if (!state.status) {
        $('#wait').show();
        $('#ready').hide();
    } else {
        $('#wait').hide();
        $('#ready').show();
    }
    clearPass();
    $('#clicker-count').css('height', 0);


}
//Check Page
$(document).ready(function () {
    clearState();
    $('.screen').hide();
    if (currentPage != "" && currentPage != "#setup-box") {
        changePage(window.location.hash);
    } else {
        changePage("#setup-box");
    }


    $('html').bind('keypress', function (e) {
        if (e.keyCode >= 48 && e.keyCode <= 57 && currentPage == "#checkpoint1" && state.Status) {
            passKeyUp(e.keyCode);
            if (passKey.length == 4) {
                if (passKey.join("") == passAns) {
                    updateDb("Checkpoint1/Status", true);
                    changePage("#checkpoint2");
                } else {
                    clearPass();
                }
            }
        }
    });

    $('html').bind('keyup', function (e) {
        if (e.keyCode == 32 && currentPage == "#checkpoint2" && state.Status) {
            if (clickerCount < 100) {
                clickerCount++;
                $('#clicker-count').css('height', clickerCount + "%");
                updateDb("Checkpoint2/Count", clickerCount);
                if (clickerCount >= 100) {
                    updateDb("Checkpoint2/Status", true);
                    changePage("#checkpoint3");
                }
                if (clickerCount > 30 && !clickerDown) {
                    clickerDown = true;
                    clickDown();
                }
            }

        }
    });
})

