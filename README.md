# Simple CloudWatch Logger

I wrote this because I do this sort of thing over and over.  This module makes it easy (for me) to
include this behaviour in many of my stack components.

This module is really designed to be used with [consign](https://github.com/jarradseers/consign) and
assumes `app.config` already exists prior to this module being fecthed and executed by consign.  Something like:

```js
let app = {}; // or app = express()
require( 'consign' )
  .include( 'lib/config' )
  .include( 'lib' )
  .into( app );
  
app.log.info( 'Here we go!' );
```

You can also use this module without consign.  See the included example.js.

## Configuration

```js
app.config = {
  logger: {
    includeNodeEnv: true,
    console: {
      enabled: true,
      level: 'error',
      colorize: true
    },
    cloudwatch: {
      enabled: true,
      level: 'debug',
      awsAccessKeyId: 'your key',
      awsSecretKey: 'your secret',
      awsRegion: 'your region',
      group: 'cloud watch group name',
      stream: 'cloud watch stream name'
    }
  }
}
```

The AWS credentials will default (if not specified) to these environment variables:

* AWS_ACCESS_KEY_ID
* AWS_SECRET_KEY
* AWS_REGION

The CloudWatch `group` will default to process.env.NODE_ENV if not specified.  The `stream` name is required, and would probably
be the name of the application.  The idea is to group multiple applications under their stack, so you can use something like
[awslogs](https://github.com/jorgebastida/awslogs) and get logs like this to mix all of the apps in the stack together:

```sh
awslogs get staging ALL --start='1d ago' --timestamp --profile aws-profile-name
```

or to get just one app:

```sh
awslogs get staging "webserver*" --start='1d ago' --timestamp --profile aws-profile-name
```




