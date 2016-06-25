var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: 'mywebsite.log',
      handleExceptions: true,
      json: false,
        //maxsize: 5242880, //5MB
        //maxFiles: 5,
        colorize: false,
        timestamp: () => {
          return Date.now();
        },
        formatter: (options) => {
        // Return string will be passed to logger.
          return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
      }),
    new winston.transports.Console({
      level: 'warn',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: () => {
        return Date.now();
      },
      formatter: (options) => {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ],
  exitOnError: false
});

module.exports = logger;

module.exports.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};