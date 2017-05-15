var express = require('express');
var mongo = require("mongodb");
var request = require("request");

var dataURL = process.env.MONGOLAB_URI;

var app = express();

var apiKey = process.env.GOOGLESEARCHKEY;
var searchEngineID = process.env.SEARCHENGINEID;


app.get('/image-search-abstraction-layer/new-search/*', function (req, res) {
	
	res.writeHead(200, {'content-type':'application/JSON'});
	
	var searchQuery = req.params[0];
	var searchType = 'image';
	var offset = req.query["offset"];
	
	var requestURL = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + 
					'&cx=' + searchEngineID + 
					'&q=' + searchQuery + 
					'&searchType=' + searchType + 	
					'&num=' + offset

					
	//Add the search to our database for recent searches				
	mongo.connect(dataURL, function(err, db) {
		
		if (err) throw err;
	   
		var recentSearchCollection = db.collection('recentSearch');
		
		var date = new Date().toJSON();
	   
		recentSearchCollection.insert({
			"term": searchQuery,
			"date": date
		}, function(err, data) {
			console.log('Search added succesfully!');
			if (err) throw err;
			db.close();
		});
	});

	
	request( {uri: requestURL, json:true}, function(error, response, body) {
		
		if (error) {
			
			res.end('There was an error with your request');
		
		} else {
			
			var imagesResponse = body["items"];
		
			var data = []
		
			var i;
		
			for (i=0; i<imagesResponse.length; i++) {
			
				var image = imagesResponse[i]
			
				data.push({
					"url": image["link"],
					"snippet": image["snippet"],
					"thumbnail": image["image"]["thumbnailLink"],
					"context": image["image"]["contextLink"]
				});
			} 
		
			res.end(JSON.stringify(data));
		}
		
	});
	
}); 

app.get('/image-search-abstraction-layer/recent-searches/', function(req, res) {
	
	res.writeHead(200, {'content-type':'application/JSON'});
	
	//Add the search to our database for recent searches				
	mongo.connect(dataURL, function(err, db) {
		
		if (err) throw err;
	   
		var recentSearchCollection = db.collection('recentSearch');
	   
		recentSearchCollection.find().limit(10).sort({_id:-1}).toArray(function(err, results){
			
			if (err) throw err;
			
			var data = []
			
			results.forEach(function(result) {
				data.push({
					"term": result["term"],
					"when": result["date"]
				});
			});
			
			res.end(JSON.stringify(data));
		});

	});

});

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port!');
});