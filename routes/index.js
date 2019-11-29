var express = require('express');
var router = express.Router();
var async = require('async');
require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

var uid = -1;

connection.connect(function(err){
  if(err){
    console.log('DB CONNECT ERROR:',err);
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

router.post('/create', function(req, res, next) {
  console.log('CREATE uid:',uid);

  if(uid == -1){
    //console.log('Create user request:',req.body);

    var data = {
      email: req.body.email, 
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      company: req.body.company,
      role: req.body.role,
      country: req.body.country,
      fk_sub_plan: req.body.sub
    };
    //console.log('Data to be inserted:',data);

    connection.query('INSERT INTO users SET ?',data, function(error,results){
      if(error){
        console.log('User Insert Error:',error);
        res.render('error.html',{error: error});
      }
      else{
        uid = results.insertId;
        console.log('User inserted:',results.insertId);
        connection.query('SELECT * FROM services WHERE fk_sub_id=?',req.body.sub,(err,result)=>{
          if(error){
            console.log('Select Services Error:',err);
            res.render('error.html',{error: err});
          }
          else{
            console.log('Got services');
            async.each(result, function(e, callback){
              console.log('Service:',e.servicename);
              var sql = 'INSERT INTO history (servicename,fk_user_id) VALUES(?,?)';
              //console.log('SQL',sql);
              //callback();
              connection.query(sql,[e.servicename,uid], (err2,result2)=>{
                if(err2){
                  console.log('History Insert Error:',err2);
                  callback(err2);
                }
                else{
                  console.log('History inserted');
                  callback();
                }
              })
            }, function(err){
              if(err){
                console.log('Async error:',err);
                res.render('error.html',{error: err});
              }
              else{
                console.log('Async complete:');
                res.render('profile.html',{data: data});
              }
            });

          }
        });

      }
    });

  }
  else{
    console.log('CREATE uid already set:',uid);
    res.redirect('/profile');
  }
});

router.post('/history', (req,res)=>{
  console.log('Get history');
  connection.query('SELECT servicename, date FROM history WHERE fk_user_id=?',uid,(err,result)=>{
    if(err){
      console.log('Get history error:',err);
      res.send(err);
    }
    else{
      //console.log('History:',result);
      res.send(result);
    }
  })
});

router.post('/change', (req,res)=>{
  console.log('Sub change:',req.body.subid);
  var newsub = parseInt(req.body.subid);
  connection.query('UPDATE users SET fk_sub_plan=? WHERE idusers=?',[newsub,uid],(error,results)=>{
    if(error){
      console.log('Error updating user sub plan:',error);
      res.send(error);
    }
    else{
      console.log('Updated user sub plan');
      connection.query('SELECT * FROM services WHERE fk_sub_id=?',newsub,(err,result)=>{
        if(error){
          console.log('Get New Services Error:',err);
          res.send(err);
        }
        else{
          console.log('Got new services');
          async.each(result, function(e, callback){
            console.log('New Service:',e.servicename);
            var sql = 'INSERT INTO history (servicename,fk_user_id) VALUES(?,?)';
            //console.log('SQL',sql);
            //callback();
            connection.query(sql,[e.servicename,uid], (err2,result2)=>{
              if(err2){
                console.log('New History Insert Error:',err2);
                callback(err2);
              }
              else{
                console.log('New History inserted');
                callback();
              }
            })
          }, function(err){
            if(err){
              console.log('New Async error:',err);
              res.send(err);
            }
            else{
              console.log('New Async complete:');
              res.send('success');
            }
          });

        }
      });
    }
  })
})

router.get('/profile', (req, res, next)=>{
  console.log('Profile UID:',uid);
  if(uid == -1){
    res.redirect('/register');
  }
  else{
    next();
  }
},(req,res)=>{
  connection.query('SELECT * FROM users WHERE idusers=?',uid,(err,result)=>{
    if(err){
      console.log('Profile get data Error:',err);
      res.render('error.html',{error: err});
    }
    else{
      console.log('Profile data:',result[0]);
      res.render('profile.html',{data: result[0]});
    }
  });
}
);

module.exports = router;
