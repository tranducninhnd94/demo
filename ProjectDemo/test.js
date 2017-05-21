 var express = require('express');
 var path = require('path');
 var app = express();
 app.get('/', function(req, res) {
    //  res.sendFile(__dirname + '/views/login.html');
    console.log(path.join(__dirname+'/views/login.html'));
     res.sendfile(path.join(__dirname+'/views/login.html'));
 });
 app.listen(3000);