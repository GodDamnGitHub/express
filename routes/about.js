var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('about');
});
router.get('/news/:year/:month/:day/',(req,res)=>{
  res.send(req.params);
});

module.exports = router;
