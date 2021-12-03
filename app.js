var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const cors = require('cors');


const mongoose = require('mongoose');
const mongoDBremoteURI = 'mongodb+srv://admin:abc12345@cluster0.colar.mongodb.net/sudoku';
const mongodbURI = (process.env.MONGODB_URL || mongoDBremoteURI);

mongoose.connect(mongodbURI);
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
  console.log(mongodbURI)
});

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//var aboutRouter = require('./routes/about');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var schema0 = mongoose.Schema({
  name: String,
  password: String,
});

var schema = mongoose.Schema({
  name: String,
  time: Number,
  createdAt: Date
});

var Model0 = mongoose.model("users", schema0);

var Model = mongoose.model("scores", schema);

app.get('/', function (req, res) {

  res.send("Hello World!");
  //res.send("finished");
})


/*app.get('/store', async (req, res) => {
  var rand = 80 + Math.floor(Math.random() * (200 - 0 + 1));

  var data = new Model({ name: "Johnson", time: rand, createdAt: new Date() });
  data.save();

  //var data = Model.find({name: "Tim"});
  //alert(data);
  //Model.create({ name: 'Tim'});
})*/

app.get('/scores', async (req, res) => {

  const data = await Model.find({}).sort('time').limit(10);

  res.send(data);
  //res.send("finished");
})

app.get('/myscores/:name', async (req, res) => {

  const data = await Model.find({name: req.params.name}).sort('time').limit(10);

  res.send(data);
  //res.send("finished");
})



app.post('/login', async (req, res) => {
  const data = await Model0.find({name: req.body.name});
  if (data.length == 0) {
    res.send("new user registered");
    var newData = new Model0(req.body);
    newData.save();
  } else if (data[0].password != req.body.password){
    res.send("wrong password");
  } else {
    res.send("login completes");
  }
})

app.post('/submit', async (req, res) => {
  var data = new Model({ name: req.body.name, time: req.body.time, createdAt: new Date() });
  data.save();
  res.send("New score submitted");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/about', aboutRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
