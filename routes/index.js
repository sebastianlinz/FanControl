var express = require('express');
var pad = require('pad-number');
var roundTo = require('round-to');
var router = express.Router();
require('../ZwiftAdapter');
var config = require('../config.js');
var logger = require('../logger');

// set DEBUG=express:* & npm start

router.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { fanState: req.app.get('fanState') });
});

router.get('/fanStateOff', function(req, res, next) {
  req.app.set('fanState', 0);
  res.render('index', { fanState: 0 });
});

router.get('/fanStateLevel1', function(req, res, next) {
  req.app.set('fanState', 1);
  res.render('index', {  fanState: 1 });
});

router.get('/fanStateLevel2', function(req, res, next) {
  req.app.set('fanState', 2);
  res.render('index', {  fanState: 2 });
});

router.get('/fanStateLevel3', function(req, res, next) {
  req.app.set('fanState', 3);
  res.render('index', {  fanState: 3 });
});

router.get('/fanStateZwiftSim', function(req, res, next) {
  req.app.set('fanState', 4);
  res.render('index', {  fanState: 4 });
});

router.get('/getFanLevel', function(req, res, next) {
  var fanState = req.app.get('fanState');
  var speed = 0;
  var fanLevel = 0;
  var power = 0;
  var heartrate = 0;
  logger.debug("fanState: " + fanState);
  if (fanState == 4) {
    try {
      var zwiftAdapter = req.app.get('zwiftAdapter');
      speed = zwiftAdapter.getSpeed();
      power = zwiftAdapter.getPower();
      heartrate = zwiftAdapter.getHeartrate();
      if (!Number.isNaN(speed) && speed < config.speedLevel1) {
        fanLevel = 0;
      } else if (!Number.isNaN(speed) && speed >= config.speedLevel1 && speed < config.speedLevel2) {
        fanLevel = 1;
      } else if (!Number.isNaN(speed) && speed >= config.speedLevel2 && speed < config.speedLevel3) {
        fanLevel = 2;
      } else if (!Number.isNaN(speed) && speed >= config.speedLevel3) {
        fanLevel = 3;
      } 
      logger.debug("speed: " + speed);
    } catch (err) {
      logger.error(err);
    }
  }
  // res.json({ fanState: fanState, speed: speed, fanLevel: fanLevel, power: power, heartrate: heartrate });
  res.send(
    'FCS' + fanState 
    + 'FLV' + fanLevel 
    + 'PWR' + pad(power, 4) 
    + 'HR' + pad(heartrate, 3) 
    + 'SPD' + pad(roundTo(speed, 1), 5)
  );
});

module.exports = router;
