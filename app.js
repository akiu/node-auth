var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var morgan = require("morgan");
var jwt = require("jsonwebtoken");
var passwordHash = require('password-slow-hash');

//db connect
mongoose.connect('mongodb://root:password@localhost/auth');

//
var app = express();

//models
var User = require("./models/User");

//---------//
app.use(bodyParser.json());
app.use(express.static('public'));

var secret = "akuadalahanakgembala";

app.use(function(req, res, next) {
	
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();

});


app.post('/api/login', function(req, res) {

	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username}, function(err, user) {
		
		if(user) {

			if(password === user.password) {

				var token = jwt.sign({ id: user.id }, secret);
				
				var response = {
					id: user.id,
					token: token,
					username: user.username,
					message: "Login Success",
					roles: ["admin"]
				};

				res.status(200).json(response);				

			} else {

				res.status(404).json({ message: "Invalid password"});
			}
			
		} else {

			res.status(404).json({ message: "User Not Found"});
		}
	});

});

app.post('/api/register', function(req, res) {

	
	var password = req.body.password;
	var username = req.body.username;
	var roles = req.body.roles;

	var user = new User({ username: username, password: password, roles: roles});

	user.save(function(err, user) {
		
		if(err) {
			
			res.setHeader('Content-Type', 'application/json');
			res.status(500).send(JSON.stringify({ message: "error"}));
		
		} else {

			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(JSON.stringify(user));
		}
	});
});

app.listen(8000, function() {

	console.log("Server di port 8000");
});