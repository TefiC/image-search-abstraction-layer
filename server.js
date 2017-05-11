var express = require('express');
var mongo = require("mongodb");

var dataURL = process.env.MONGOLAB_URI;

var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port!')
})