var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', {title: 'Express'});
  Entry.getRange(0, -1, (err, entries) => {
    if (err) {
      return next(err);
    }
    res.render('entries', {
      title: 'Entries',
      entries: entries
    });
  });
});

module.exports = router;
