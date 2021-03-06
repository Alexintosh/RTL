var fs = require('fs');
var request = require('request');
var options = require("../connect");
var common = require('../common');

exports.getPeers = (req, res, next) => {
  options.url = common.lnd_server_url + '/peers';
  request.get(options, (error, response, body) => {
    console.log('Peers Received: ' + JSON.stringify(body));
    if(error) {
      res.status(500).json({
        message: "Fetching peers failed!",
        error: error
      });
    } else {
      res.status(200).json(body.peers);
    }
  });
};

exports.postPeer = (req, res, next) => {
  // setTimeout(()=>{res.status(201).json({message: 'Peer Added!'});}, 5000);
  options.url = common.lnd_server_url + '/peers';
  options.form = JSON.stringify({ 
    addr: { host: req.body.host, pubkey: req.body.pubkey },
    perm: req.body.perm
  });
  console.log('Options: ' + JSON.stringify(options));
  request.post(options, (error, response, body) => {
    console.log('Peer Add Response: ');
    console.log(body);
    if(undefined === body || body.error) {
      res.status(500).json({
        message: "Adding peers failed!",
        error: (undefined === body) ? 'Error From Server!' : body.error
      });
    } else {
      res.status(201).json({message: 'Peer Added!'});
    }
  });
};
