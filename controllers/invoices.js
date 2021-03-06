var request = require('request');
var options = require("../connect");
var common = require('../common');

exports.listInvoices = (req, res, next) => {
  options.url = common.lnd_server_url + '/invoices';
  request.get(options, (error, response, body) => {
    const body_str = (undefined === body) ? '' : JSON.stringify(body);
    const search_idx = (undefined === body) ? -1 : body_str.search('Not Found');
    console.log('Information Received: ' + body_str);
    if(undefined === body || search_idx > -1 || body.error) {
      res.status(500).json({
        message: "Fetching Invoice Info failed!",
        error: (undefined === body || search_idx > -1) ? 'Error From Server!' : body.error
      });
    } else {
      if (undefined !== body.invoices) {
          body.invoices.forEach(invoice => {
            invoice.creation_date_str =  (undefined === invoice.creation_date) ? '' : common.convertTimestampToDate(invoice.creation_date);
            invoice.settle_date_str =  (undefined === invoice.settle_date) ? '' : common.convertTimestampToDate(invoice.settle_date);
            invoice.btc_value = (undefined === invoice.value) ? 0 : common.convertToBTC(invoice.value);
            invoice.btc_amt_paid_sat =  (undefined === invoice.amt_paid_sat) ? 0 : common.convertToBTC(invoice.amt_paid_sat);
          });
        }
      console.log('\nInvoices Received: ' + JSON.stringify(body));
      res.status(200).json(body);
    }
  });
};

exports.addInvoice = (req, res, next) => {
  options.url = common.lnd_server_url + '/invoices';
  options.form = JSON.stringify({ 
    memo: req.body.memo,
    value: req.body.amount
  });
  console.log('Add Invoice Options Form:' + options.form);
  request.post(options, (error, response, body) => {
    console.log('Add Invoice Response: ');
    console.log(body);
    if(undefined === body || body.error) {
      res.status(500).json({
        message: "Add Invoice Failed!",
        error: (undefined === body) ? 'Error From Server!' : body.error
      });
    } else {
      res.status(201).json(body);
    }
  });
};
