var dns = require("dns");
var url = require("wurl");

var dnsIps = ["208.67.222.123","208.67.220.123"]
var blockIP = "146.112.61.106";

dns.setServers(dnsIps);

// dns lookup middleware
// pre-requisite parsed body available by using body-parser
// resolves a dns to it's ip and attaches it to the request of object as
// dnsIP property
function parseDnsIP (req, res, next) {
  if (req.body.url) {
    var hostname = url("hostname", req.body.url);
    dns.lookup(hostname, function (error, result) {
      if (error) {
        next(error);
      }
      if (result) {
        req.dnsIP = result;
      }
      next();
    });
  }
  else {
    console.log("no url available to parse");
    next();
  }
}


// checks against the block open dns ip and returns true if safe false if not
// safe

function isSafe (dnsIP) {
  if (dnsIP == blockIP) {
    return false;
  }
  else {
    return true;
  }
}


module.exports = {
  parseDnsIP: parseDnsIP,
  isSafe: isSafe
}
