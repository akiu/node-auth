var mongoose = require("mongoose");
var Q = require("q");
var bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	roles: Array
});


userSchema.methods.login = function login() {

	var deferred = Q.defer();

	this.model('User').find({ username: this.username }, function(err, user) {

		if(err) {

			deferred.reject("User Not Found");
		
		} else {

			if(bcrypt.compareSync(this.password, user.password)) {

				deferred.resolve(user);
			
			} else {

				deferred.reject("Password Not Match");
			}
		}
		
		return deferred.promise;
	});
}

var User = mongoose.model('User', userSchema);

module.exports = User;