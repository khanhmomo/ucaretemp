const firebase = require("./firebase_connect");

var uuid = require('uuid');



module.exports = {
    saveData: function(req, callback) {
        let username = req.username;
        var id = uuid.v1();
        var name;
        firebase.database().ref("Student/" + username + "/log/" + id).set({
            temp: req.temp,
        });
        callback(null, {"statuscode":200, "temp":req.temp, "user": username});
    }
}