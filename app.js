//Intital Setup for Node js 
var express    = require("express"),
    bodyParser = require("body-parser"),
	http       = require('http'),
	request = require('request'),
	cheerio = require('cheerio'),
	Crawler = require("node-webcrawler"),
    URL = require('url-parse'),
    app        = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//=============================================
//				INITIAL SETUP OVER
//=============================================
app.get("/", function(req, res){
	res.render("index");
});
app.post("/submit", function(req, res){
	//Just Some Initial Work 
	var sizeDisplay;
	var retrySize;
	var linkToSameDomain = [];
	//Checking if it is a Valid url
	var pageToVisit = req.body.URLvalue;
	//Actual Computation
	var url = new URL(pageToVisit);
	//console.log(url);
	var c = new Crawler({
		maxConnections : 10,
		// This will be called for each crawled page
		callback : function (error, result, $) {
			if(error){
				console.log(error);
			}else{
				console.log("==================================");				
				console.log(result.request.responseContent. bytesRead);
				retrySize = result.request.responseContent. bytesRead;
				console.log("==================================");
			}
		}
	});
	c.queue(pageToVisit);
	
	// var req = http.request({ 
	//     host: url.host,
	//     port: 80,
	//     path: url.pathname,
	//     method: 'HEAD' }, 
	//     function(res) {
	// 		console.log("Size: " + res.headers['content-length']);
	// 		sizeDisplay = res.headers['content-length'];
	// 		//console.log(res.headers);
			
	//     }
	// ).end();

	
// ============================================================ //
//			Determing the Size of Web Page Kinda Over!
//To Determine the number of links pointing to the same Domain
// ============================================================ //	
	request(pageToVisit, function(error, response, body) {
		var allAbsoluteLinks = [];
		
		if(error) {
		  console.log("Error: " + error);
		}
		// Check status code (200 is HTTP OK)
		console.log("Status code: " + response.statusCode);
		if(response.statusCode === 200) {
			// Parse the document body
			var $ = cheerio.load(body);
			//console.log("Page title:  " + $('title').text());
			var absoluteLinks = $("a[href^='http']");
			absoluteLinks.each(function() {
				allAbsoluteLinks.push($(this).attr('href'));
			});
			//console.log( allAbsoluteLinks );
			for(var i = 0;i < allAbsoluteLinks.length;i++){
				var firstDot = allAbsoluteLinks[i].indexOf(".");
				var dotCuttedUrl = allAbsoluteLinks[i].slice(firstDot, allAbsoluteLinks[i].length);
				//Now to Remove the First Slash in dotCuttedUrl
				var firstSlash = dotCuttedUrl.indexOf("/");
				var pathURl = dotCuttedUrl.slice(firstSlash, dotCuttedUrl.length);
				var hostURL = dotCuttedUrl.slice(0, firstSlash);
				console.log(hostURL);
				hostURL = "www"+hostURL;
				if(hostURL == url.host){
					linkToSameDomain.push(hostURL+pathURl);
				}
				
				// console.log(firstSlash);
			}
			console.log(linkToSameDomain.length);
		}
	});
	
	//Redering the Result to the result page
	setTimeout(function(){
		//console.log(sizeDisplay);
		res.render("result", {urlSize: retrySize, linkToSameDomain: linkToSameDomain});
	},5000)
	
});

//======================================
//	ENV SETUP, TURNING UP THE SERVER
//======================================
app.listen(4400, function(){
	console.log("Server running at http://localhost:4400/");
});