$(document).ready(function(){
    // play theme song when page loads
    // $("#theme").play();

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyDLVug3tKhRmxP-0wLLdHh1wGzAyRV7mjs",
    authDomain: "isleofsodorschedule.firebaseapp.com",
    databaseURL: "https://isleofsodorschedule.firebaseio.com",
    projectId: "isleofsodorschedule",
    storageBucket: "isleofsodorschedule.appspot.com",
    messagingSenderId: "256988749653"
    };

    firebase.initializeApp(config);

    //create reference variable for database
    var db = firebase.database();

    // initial values
    var name = "";
    var dest = "";
    var freq = "";
    var minutesAway = "";
    var firstTrain = "";

    var now = moment();

    // catpure submit btn click
    $("#add").on("click", function(e){
        e.preventDefault();

        // grab values from the text boxes
        name = $("#train-name").val().trim();
        dest = $("#destination").val().trim();
        firstTrain = $("#first-time").val().trim();
        freq = $("#frequency").val().trim();
    
        var start = moment(firstTrain, "hh:mm A");

        var minutesElapsed = now.diff(start, "minutes");
    
        var stopsElapsed = Math.floor(minutesElapsed / freq);
    
        var nextStopMinutes = (stopsElapsed + 1) * freq;
        
        var nextTrain = start.add(nextStopMinutes, "minutes");
        console.log(start);
        
        minutesAway = nextTrain.diff(now, 'minutes');
        console.log(minutesAway);

        // code for handling the push
        db.ref().push({
            name: name,
            dest: dest,
            firstTrain: firstTrain,
            freq: freq,
            nextArrival: moment(nextTrain).format("HH:mm A"),
            minutesAway: minutesAway
        });
    });

    // firebase watcher
    db.ref().on("child_added", function(snapshot){
        var sv = snapshot.val();

        // console.log(sv.nextArrival);

        // change the html to reflect
        var data = "<tr><th scope='row'>"+sv.name+"</th><td>"+sv.dest+"</td><td>"+sv.freq+"</td><td>"+sv.nextArrival+"</td><td>"+sv.minutesAway+"</td></tr>";

        // adding data to our table
        $("#train-table").append(data);
        });
});