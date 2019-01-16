var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors())

app.get('/', function (req, res) {
  res.send(req.params);
  console.log(req.params);
});

app.post('/', function (req, res) {
    console.log(req.body);
  res.send(req.body);
});

app.put('/', function (req, res) {
    res.send(req.body);
    console.log(req.body);
});

app.delete('/', function (req, res) {
    res.send(req.body);
    console.log(req.body);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
