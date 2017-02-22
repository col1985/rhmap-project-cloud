var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var log = require('./../lib/logger')('pingRoute');
var fh = require('fh-mbaas-api');
var serviceID = require('./../package.json').serviceID;
var count = 0;

function pingRoute() {
    var ping = new express.Router();
    ping.use(cors());
    ping.use(bodyParser());

    // GET REST endpoint - query params may or may not be populated
    ping.get('/', function(req, res) {
        log.info('In ping route GET / req.query=', req.query);
        var path = req.query && req.query.path ? req.query.path : '/ping';

        fh.service({
            "guid": serviceID,
            "path": path,
            "method": "GET",
            "params": {
                "hello": "world",
                "count": count++
            },
        }, function(err, body, resp) {
            log.info('service Call statuscode: %s', resp && resp.statusCode);
            if (err) {
                log.error('service Call error: ', err);
                res.status(resp.statusCode).json({
                    err: err.toString()
                })
            } else {
                // log.info('service Call error: %s', err.toString());
                res.status(resp.statusCode).json({
                    status: resp.statusCode,
                    body: body
                });
            }
        });
    });

    return ping;
}

module.exports = pingRoute;