var bunyan = require('fh-bunyan');

bunyan.setLogMappings({
    'dev': 'trace',
    'prod': process.env.LOG_LEVEL
});

module.exports = bunyan.getLogger;