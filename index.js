const winston = require( 'winston' );
const WinstonCloudWatch = require( 'winston-cloudwatch' );

module.exports = function( config ) {

  let transports = [];

  if ( config.console && config.console.enabled ) {
    transports.push(
      new (winston.transports.Console)({
        handleExceptions: true,
        humanReadableUnhandledException: true,

        level: config.console.level || 'debug',
        timestamp: true,
        colorize: config.console.colorize || false,
        prettyPrint: function( meta ) {
          if ( meta && meta.trace && meta.stack && meta.stack.length ) {
            if ( Array.isArray( meta.stack ) )
              return "\n" + meta.stack.slice(1).join( "\n" );
            else
              return "\n" + meta.stack;
          }
          if ( config.includeNodeEnv ) {
            if ( ! meta ) meta = { env: process.env.NODE_ENV };
            else if ( typeof meta === 'object' ) meta['env'] = process.env.NODE_ENV;
          }
          return JSON.stringify( meta );
        },
      })
    );
  }

  if ( config.cloudwatch && config.cloudwatch.enabled ) {

    if ( ! config.cloudwatch.stream )
      throw( 'CloudWatch requires a stream name parameter!' );

    const formatError = (e, lvl) => {
      return {
        message: e.message,
        level: lvl || 'error',
        stack: e.stack
      };
    };

    let startTime = new Date().toISOString();
    const crypto = require('crypto');

    transports.push(
      new WinstonCloudWatch({
        level: config.cloudwatch.level || 'debug',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        awsAccessKeyId: config.cloudwatch.awsAccessKeyId || process.env.AWS_ACCESS_KEY_ID,
        awsSecretKey: config.cloudwatch.awsSecretKey || process.env.AWS_SECRET_KEY,
        awsRegion: config.cloudwatch.awsRegion || process.env.AWS_REGION,
        logGroupName: config.cloudwatch.group || process.env.NODE_ENV || 'local',
        logStreamName: () => {
          let date = new Date().toISOString().split('T')[0];
          return config.cloudwatch.stream + '.' + date + '-' +
                 crypto.createHash('md5')
                           .update(startTime)
                           .digest('hex');
        },
        messageFormatter: (msg) => {
          if ( msg instanceof Error ) msg = formatError( msg, msg.level );
          if ( msg.meta && msg.meta instanceof Error ) msg.meta = formatError( msg.meta, msg.level );
          msg.program = config.cloudwatch.stream;
          if ( config.includeNodeEnv ) {
            msg.env = process.env.NODE_ENV;
          }
          return JSON.stringify( msg );
        }
      })
    );
  }

  let log = new (winston.Logger)({
    transports: transports,
  });

  return log;
}
