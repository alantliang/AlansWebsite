var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var request = require('request');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/views/index.html"));
	// res.render("public/views/index.html");
});

app.get('/steamgames', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/views/steamgames.html"));
});

app.get('/progressPics', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/views/progress.html"));	
});

app.get('/rankedstats', function(req, res) {
	req.pipe(request.get(
		"https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" +
		"Xtraneus?api_key=60da754a-f013-4cf7-886d-93cfec6bc963"))
		.pipe(res);
});

// not official documentation, so can change. Used to support multiple ids, now only one
//"http://store.steampowered.com/api/appdetails?appids=241930"
app.get("/gamestats/:appid", function(req, res) {
	var appid = req.params.appid;
	console.log(appid);
	request.get("http://store.steampowered.com/api/appdetails?appids=" + appid).pipe(res);
});

app.get('/steamgamesdata', function(req, res) {
	console.log("making steamgames request");
	var theData = "";
	req.pipe(
		request.get("http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?" +
			"key=3CD6E1EF14A9AC464E0E7A75BF49D9E0&steamid=76561198018239932&" +
			"include_appinfo=1&format=json28")
		.on('response', function(response) {
			response.on('data', function(data) {
				theData += data;
			}).on('end', function() {
				res.json(JSON.parse(theData));
			});
		})
	);
});


var server = app.listen(3000, function() {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});

// curl --request GET 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/Xtraneus?api_key=60da754a-f013-4cf7-886d-93cfec6bc963' --include
// curl --request GET 'https://na.api.pvp.net//api/lol/{region}/v1.3/stats/by-summoner/19464241/ranked?api_key=60da754a-f013-4cf7-886d-93cfec6bc963'