var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');

var mongoUtil = require( '../database/mongoUtil' );
var db = mongoUtil.getDb();


var schema = mongoose.Schema({
  name: String,
  age: Number
});

var Model = mongoose.model("names", schema);


/* GET home page. */
router.get('/', function(req, res, next) {
  //var data = new Model({ name: "Jack", age: 44 });
  //data.save();
  //res.send("finished");
  var data = db.collection('names').find({name: "Tim"});
  res.json(data);
});

module.exports = router;
