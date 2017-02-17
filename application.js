var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var pkg = require('./package.json')
var log = require('./lib/logger')(pkg.name);
var reqTimer = require('fh-request-timer');

// list the endpoints which you want to make securable here
var securableEndpoints = [
    '/push'
];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// request timer
app.use(reqTimer());

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/push', require('./routes/push.js')());
app.use('/ping', require('./routes/ping.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, host, function() {
    log.info('%s started on port: %s', pkg.name, port);
});