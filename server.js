var express = require('express');
var mongo = require("mongodb");

var dataURL = process.env.MONGOLAB_URI;

var app = express();

app.get('/', function (req, res) {
	
	mongo.connect(dataURL, function(err, db) {
		if (err) throw err;
	   
		var recentSearchCollection = db.collection('recentSearch');
	   
		recentSearchCollection.insert({
			"a":"Test"
		}, function(err, data) {
			if (err) throw err;
			
			res.end(JSON.stringify(data));
		});
	  
	});  

	res.send('Hello World!');
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port!');
})