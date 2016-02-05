// exports
var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');
var fs            = require('node-fs');
var db            = mongoose.connect('mongodb://localhost/profilesysDB');
var upload = multer({ dest: './uploads/' });

// setup the app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(session({ secret: 'this is the secret' }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// user model schema for database
var UserSchema = new mongoose.Schema(
{
    username: String,// this stores the email
    displayname:String, // real name
    password: String,
    joined:String,
    gender: String,
    location:String,
    description: String,
    phone: Number,
    ip:String,
    device:String,
    img: Buffer,
    history: [String],
    roles: [String]
}, {collection: "user"});

var UserModel = mongoose.model('UserModel', UserSchema);

// use passport local strategy to log in users
passport.use(new LocalStrategy(
function(username, password, done)
{
    UserModel.findOne({username: username, password: password}, function(err, user)
    {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
    })
}));

// passport config
passport.serializeUser(function(user, done)
{
    done(null, user);
});
// passport config
passport.deserializeUser(function(user, done)
{
    UserModel.findById(user._id, function(err, user)
    {
        done(err, user);
    });
});

// log in call, here we call passport to handle the log in
// we take user's ip address and device info in user data model
app.post("/login", passport.authenticate('local'), function(req, res)
{
    var user = req.user;

    if(user){
      var ip = req.connection.remoteAddress;
      console.log(JSON.stringify(req.headers));
      user.ip = ip;
      user.device = req.headers['user-agent'];
      user.update(user, function(err, count)
      {

      });
      //user.
      //console.log(req.header);
    }

    res.json(user);
});

// check if the user is logged in
app.get('/loggedin', function(req, res)
{
    res.send(req.isAuthenticated() ? req.user : '0');
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.send(200);
});

// call to register new user
app.post('/register', function(req, res)
{
    var newUser = req.body;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = dd+'/'+mm+'/'+yyyy;
    newUser.joined = today;

    // assign privileges
    UserModel.count(function (err, count){
    if (!err && count === 0) {
        newUser.roles = ['superadmin','admin']; //very first user ia a super admin
    }
    else{
        newUser.roles = ['user'];
    }
    });


    UserModel.findOne({username: newUser.username}, function(err, user)
    {
        if(err) { return next(err); }
        if(user)
        {
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function(err, user)
        {
            req.login(user, function(err)
            {
                if(err) { return next(err); }
                res.json(user);
            });
        });
    });
});

// auth middleware
var auth = function(req, res, next)
{
    if (!req.isAuthenticated())
    {
        res.send(401);
    }
    else
    {
        next();
    }
};

// return all the users from the database
app.get("/rest/user", auth, function(req, res)
{
    UserModel.find(function(err, users)
    {
        res.json(users);
    });
});

//return the user with given id
app.get("/rest/user/:id", auth, function(req, res)
{
    UserModel.findById(req.params.id, function(err, user)
    {
            res.json(user);
    });
});

// delete the user with given id
app.delete("/rest/user/:id", auth, function(req, res)
{
    UserModel.findById(req.params.id, function(err, user)
    {
        user.remove(function(err, count)
        {
            UserModel.find(function(err, users)
            {
                res.json(users);
            });
        });
    });
});

// udate the user datamodel based on user id
app.put("/rest/user/:id", auth, function(req, res)
{
    UserModel.findById(req.params.id, function(err, user)
    {
        user.update(req.body, function(err, count)
        {
            UserModel.find(function(err, users)
            {
                res.json(users);
            });
        });
    });
});

// search for user
app.post("/rest/user", auth, function(req, res)
{
    UserModel.findOne({username: req.body.username}, function(err, user)
    {
        if(user == null)
        {
            user = new UserModel(req.body);
            user.save(function(err, user)
            {
                UserModel.find(function(err, users)
                {
                    res.json(users);
                });
            });
        }
        else
        {
            UserModel.find(function(err, users)
            {
                res.json(users);
            });
        }
    });
});

// handle image uploading
app.put("/rest/upload", function(req, res, next)
{
  console.log("received image..");
	var imageData = req.body.pic;
	//make sure user is logged in
	var usr = req.session.user;
	if(usr == null){
		console.log("Session not available");
		res.json(null);
	}
	else{
		//user is logged in, now we save the image
		usr.img.data = imageData;
		usr.img.contentType = 'base64';
		//search for the user with email
		User.findOne(req.params.id, function(err, usr_){
			if (err){
		        res.send(err);
		    }
			else {
				usr.img.data=imageData;
				usr.img.contentType = 'base64';
				usr.save(function(err) {
			        if (err){
			            res.send(err);
			        }
			        else{
				        console.log("saved Image");
				        //console.log("pic received_: "+usr_.img.data);
				        req.session.user = usr;
				        res.json(usr);
			    	}
		    	});
			}
	    });
	}
});
app.listen(3000);
