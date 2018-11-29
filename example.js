let app = {
  config: {
    logger: {
      includeNodeEnv: true,
      console: { enabled: true },
      cloudwatch: {
        enabled: true,
        group: 'staging',
        stream: 'webserver'
      }
    }
  }
};

require( './index' )( app );

app.log.info( 'info message', { some: 'metadata' } );
app.log.debug( 'a debug message', 'with an argument' );
app.log.error( 'an error:', new Error('this is an error'));

app.log.error( new Error( 'error with no message' ) );

throw( new Error( 'thrown' ) );
