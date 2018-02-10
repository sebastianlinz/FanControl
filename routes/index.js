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
  req.app.set('fanLevel', 0);
  res.render('index', { fanState: 0 });
  logger.debug("/fanStateOff fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/fanStateLevel1', function(req, res, next) {
  req.app.set('fanState', 1);
  req.app.set('fanLevel', 1);
  res.render('index', {  fanState: 1 });
  logger.debug("/fanStateLevel1 fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/fanStateLevel2', function(req, res, next) {
  req.app.set('fanState', 2);
  req.app.set('fanLevel', 2);
  res.render('index', {  fanState: 2 });
  logger.debug("/fanStateLevel2 fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/fanStateLevel3', function(req, res, next) {
  req.app.set('fanState', 3);
  req.app.set('fanLevel', 3);
  res.render('index', {  fanState: 3 });
  logger.debug("/fanStateLevel3 fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/fanStateZwiftSim', function(req, res, next) {
  req.app.set('fanState', 4);
  res.render('index', {  fanState: 4 });
  logger.debug("/fanStateZwiftSim fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/fanStateZwiftWrkt', function(req, res, next) {
  req.app.set('fanState', 5);
  res.render('index', {  fanState: 5 });
  logger.debug("/fanStateZwiftWrkt fanState: " + req.app.get('fanState') + ", fanLevel: [" + req.app.get('fanLevel') + "]");
});

router.get('/getFanLevel', function(req, res, next) {
  var fanState = req.app.get('fanState');
  var speed = 0;
  var fanLevel = req.app.get('fanLevel');
  var power = 0;
  var heartrate = 0;
  logger.debug("/getFanLevel fanState: " + fanState + ", fanLevel: [" + fanLevel + "]");
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
      req.app.set('fanLevel', fanLevel);
      logger.debug("/getFanLevel fanState: " + fanState + ", fanLevel: [" + fanLevel + "], hr: " + heartrate + ", speed: " + speed);
    } catch (err) {
      logger.error(err);
    }
  } else if (fanState == 5) {
    try {
      var zwiftAdapter = req.app.get('zwiftAdapter');
      speed = zwiftAdapter.getSpeed();
      power = zwiftAdapter.getPower();
      heartrate = zwiftAdapter.getHeartrate();
      if (!Number.isNaN(speed) && !Number.isNaN(heartrate) && heartrate > config.heartrate) {
        if (power < config.powerLevel1) {
          fanLevel = 0;
        } else if (power >= config.powerLevel1 && power < config.powerLevel2) {
          fanLevel = 1;
        } else if (power >= config.powerLevel2 && power < config.powerLevel3) {
          fanLevel = 2;
        } else if (power >= config.powerLevel3) {
          fanLevel = 3;
        }
      }
      req.app.set('fanLevel', fanLevel);
      logger.debug("/getFanLevel fanState: " + fanState + ", fanLevel: [" + fanLevel + "], hr: " + heartrate + ", power: " + power);
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
