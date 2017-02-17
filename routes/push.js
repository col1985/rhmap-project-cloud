var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var $fh = require('fh-mbaas-api');

function pushNotificationRoute() {
    var push = new express.Router();
    push.use(cors());
    push.use(bodyParser());


    // trivial GET REST endpoint
    push.get('/', function(request, response) {
        console.log(new Date(), 'About to send a Push Notification to the internal Push Server');

        // create the push notification payload:
        var message = {
            'alert': 'Hello Push Notification!',
            'sound': 'default'
        };

        var options = {
            // Using broadcast:true to send push to all client apps in the project
            // See http://docs.feedhenry.com/v3/api/api_push.html#api_push-node_js_api
            broadcast: true
        };

        // dispatch the payload message to the internal push server
        $fh.push(message, options, function(err, res) {
            if (err) {
                console.log('Push error:' + err.toString());
            } else {
                console.log("status from Unified Push : " + res.status);
            }
        });

        // return 202 (Accepted) to indicate that message to push server was triggered
        response.status(202).json({ msg: 'Message to internal Push server delivered for further processing!' });
    });

    return push;
}

module.exports = pushNotificationRoute;