const express = require('express')

const path = require('path');
const { listenerCount } = require('process');
const { get } = require('request')
const app = express()
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankhanhct@gmail.com',
    pass: 'Khanhmomo2552003'
  }
});



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')

app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'weights')))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'images')));

app.set("view engine", "ejs");


var server = require("http").createServer(app);


var temp = 0;
var user = "Unknown";

const ofirebase = require("./public/js/setData.js");
const ogetData = require("./public/js/getData.js");
const { response } = require('express');

var id_user;
var stat = 0;

var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on ("sta", function (data) {
      console.log(stat);
      id_user = data;
      var username = id_user;
      var status = 2;
      if (username == null) user = "Unknown";
      else status = username.search("known");



      
      if (status != 2) {
        ogetData._getData({"username": username}, function(data) {
          user = data;
        })
        io.sockets.emit ("sta_back",{data_temp: temp, data_user: user, alert: stat});
      }
      else {
        user = "Unknown";
        io.sockets.emit ("sta_back",{data_temp: temp, data_user: user, alert: stat});
      }
      stat = 0;
    });

});

app.get('/',(req, res) => res.render('main'));
app.get('/index',(req, res) => res.render('index'));
app.get('/webcamlive',(req, res) => res.render('webcamlive'));
app.get('/login',(req, res) => res.render('login'));
app.get('/signup',(req, res) => res.render('signup'));


app.post("/login", function(req, res) {
  var acc = req.body.account;
  var pas = req.body.password;
  if (acc == "admin" && pas == "admin") res.render('index');
  acc = '';
  pas = ''
});
app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

var port =  process.env.PORT || 3000;
server.listen(port, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}


app.post("/savedata/", function(req, res) {

  var inputuser = req.body;
  console.log("OK");
  inputuser["username"] = id_user;
  console.log(inputuser);
  ofirebase.saveData(req.body, function(err,data) {
    temp = data.temp;
    
    var username = id_user;
    console.log(username);
    
    if (temp > 37.5) {
      stat = 1;
      var mailOption = {
        from: 'ankhanhct@gmail.com',
        to: 'ankhanhct@gmail.com',
        subject: 'ALERT FROM UCARETEMP - HIGH TEMP DETECTED!',
        text: 'Your student: ' + id_user + ' is having Covid - 19 sign!'
      }
      transporter.sendMail(mailOption, function(error, info) {
        if (error) {
          console.log(error);
        }
        else {
          console.log('Email send: ' + info.response);
        }
        
        
      })

    }
    else {
      stat = 0;
    }
    res.send(data);
    
    res.end();
  });
});

var id;
var first_nm;
var last_nm;
var dob;
var gen;
var phonenum;
var state;

app.post("/signup/", function(req, res) {
  console.log(req);
  ofirebase.saveData2(req.body, function(err,data) {
    id = req.body.id;
    first_nm = req.body.first_name;
    last_nm = req.body.last_name;
    dob = req.body.birthday;
    gen = req.body.male;
    email = req.body.email;
    phonenum = req.body.phone;
    state = req.body.flatform;
    console.log(req.body); 

    res.render('signup');
    res.end();
  });
});

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
        }
      },
      returnBuffer ? { encoding: null } : {}
    );

    get(options, function(err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}

