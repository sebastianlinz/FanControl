var winston = require('winston');
winston.emitErrs = true;
var logger = new winston.Logger({exitOnError: false});

logger.addConsole = function(config) {
    logger.add (winston.transports.Console, config);
};

logger.addFile = function(config) {
    logger.add (winston.transports.File, config);
};

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};