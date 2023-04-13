var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors');

var app = express();
app.use(cors());;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', function(req, res, next) {
    const credentials = req.body;
    console.log(req, req.body);
    switch(credentials.username) {
      case "Admin": {
        res.send({
          authenticated: true,
          isAdmin: true
        });
        break;
      }
      case "User 1": {
        res.send({
          authenticated: true,
          isAdmin: false
        })
        break;
      }
      default: {
        res.send({
          error: "Invalid User",
          authenticated: false,
          isAdmin: false
        });
      }
    }
    res.render('index', { title: 'Express' });
  });

module.exports = app;
