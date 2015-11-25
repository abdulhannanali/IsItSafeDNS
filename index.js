var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var cors = require("cors");

var dnsLookup = require("./dnsLookup");

var PORT = process.env.PORT || 8000;

var app = express();

app.use(morgan("dev", {}));
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.post("/", dnsLookup.parseDnsIP, (function(req, res, next) {
    if (!req.dnsIP) {
      next();
    }
    if (dnsLookup.isSafe(req.dnsIP)) {
        res.send("true");
    }
    else {
      res.send("false");
    }
}));


// not found middleware
app.use(function (req, res, next) {
  res.status(404);
  res.send("not found");
})

// dns look up error middleware
app.use(function (error, req, res, next) {
  if (error.code == "ENOTFOUND" && error.syscall == "getaddrinfo") {
    res.send("hostname not found");
  }
  else {
    next(error);
  }
})

app.use(function (error, req, res, next) {
  res.status(500);
  res.send("error occured");
})


app.listen(PORT, function () {
  console.log("Server is listening on PORT " + PORT);
})
