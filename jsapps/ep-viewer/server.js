var express = require('express');
var cors = require('cors')
var app = express();

app.use(cors())

app.use("/js", express.static('./js/'));
app.use(express.static('public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})