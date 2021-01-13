const firebase = require("./firebase_connect");

module.exports = {
    _getData: function(req, callback) {
        var username = req.username;
        firebase.database().ref("Student/" + username).once("value").then(function(snapshot) {
            callback(snapshot.val().name);
        })
    }
}