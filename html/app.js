var express = require('express');
var bodyParser = require('body-parser');

var app = express();



app.use(express.static('views'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));




app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
});



app.listen(9381);