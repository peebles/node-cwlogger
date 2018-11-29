let config = {
  includeNodeEnv: true,
  console: { enabled: true },
  cloudwatch: {
    enabled: false,
    group: 'staging',
    stream: 'webserver'
  }
};

const log = require( './index' )( config );

log.info( 'info message', { some: 'metadata' } );
log.debug( 'a debug message', 'with an argument' );
log.error( 'an error:', new Error('this is an error'));
log.error( new Error( 'error with no message' ) );

throw( new Error( 'thrown' ) );
