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
    },
    saveData2: function(req, callback) {
        let username = req.id;
        firebase.database().ref("Student/" + username).set({
            first_nm: req.first_name,
            last_nm: req.last_name,
            dob: req.birthday,
            gen: req.male,
            email: req.email,
            phonenum: req.phone,
            state: req.flatform,
        });
        callback(null, {"statuscode":200, "user": username});
    }
}