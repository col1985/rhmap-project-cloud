var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var log = require('./lib/logger')('pingRoute');
var fh = require('fh-mbaas-api');
var serviceID = 'rkkyacp5h6oplrnm7zuqai5b';
var count = 0;

function pingRoute() {
    var ping = new express.Router();
    ping.use(cors());
    ping.use(bodyParser());

    // GET REST endpoint - query params may or may not be populated
    ping.get('/', function(req, res) {
        log.info('In ping route GET / req.query=%s', req.query);
        var path = req.query && req.query.path ? req.query.path : '/ping';

        fh.service({
            "guid": serviceID,
            "path": path,
            "method": "POST",
            "params": {
                "hello": "world",
                "count": count++
            },
        }, function(err, body, res) {
            log.info('service Call statuscode: %s', res && res.statusCode);
            if (err) {
                log.error('service Call error: %s', err.toString());
                res.status(res.statusCode).json({
                    err: err.toString()
                })
            } else {
                log.info('service Call error: %s', err.toString());
                res.status(res.statusCode).json({
                    status: res.statusCode,
                    body: body
                });
            }
        });
    });

    return ping;
}

module.exports = pingRoute;