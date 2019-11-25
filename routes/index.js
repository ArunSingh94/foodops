var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'mydb.cnuipuiqebbi.us-east-1.rds.amazonaws.com',
  user: 'root',
  password: 'dangerzone1',
  database: 'new_schema'
});

connection.connect(function(err){
  if(err){
    console.log('DB CONNECT ERR:',err);
    return;
  }
  else{
    console.log('CONNECTED TO DB');
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/subs', function(req, res, next) {
  res.render('subs.html', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register.html', { title: 'Express' });
});

router.post('/profile', function(req, res) {
  console.log('Register req:',req.body);
  var username = req.body.username;
  var password = req.body.password;
  console.log('Username:',username);
  console.log('Password:',password);
  var user = {username: username, password: password};
  connection.query('INSERT INTO users SET ?',user, function(error,results){
    if(error){
      console.log('User Insert Error:',error);
      return;
    }
    else{
      console.log('User inserted:',results);
      res.render('profile.html',{usr: username, psw: password});
    }
  })
});

router.get('/profile', function(req, res, next) {
  var username = 'TEST';
  var password = 'TEST';
  res.render('profile.html', { usr: username, psw: password});
});

module.exports = router;
