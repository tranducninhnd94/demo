var express = require('express')
    , routes = require('./routes')
    , app = express()
    , db = require('./models')
    , http = require('http')
    , passportConfig = require('./config/passport')
    , home = require('./routes/home')
    , passport = require('passport')
    , application = require('./routes/application')
    , newUser = require('./routes/register')
    , io = require('socket.io');

app.set('views', __dirname + '/views');

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);


app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'Secret', resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

if ('development' === app.get('env')) {
    app.use(express.errorHandler())
}

app.get('/', routes.index);
app.get('/home', application.isAuthenticated, home.homepage);
app.post('/authenticate', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/'
}))
app.get('/logout', application.destroySession);
app.get('/signup', newUser.signUp);
app.post('/register', newUser.register);

var server = http.createServer(app);


var io = require('socket.io').listen(server);

server.listen(app.get('port'), function () {
    console.log('Server is listening on port ' + app.get('port'));
});


users = [];
contentChat = [];

var home = io.of('/home').on('connection', function (socket) {
    console.log(' connected ');
    // loadContentChat();

    socket.on('disconnect', function (data) {
        console.log('disconnected');
        users.splice(users.indexOf(socket.name), 1);
        updateUser();
    });

    socket.on('new user', function (data) {
        socket.name = data.username;
        if (users.indexOf(data.username) == -1) {
            users.push(data.username);
        }
        console.log(data.username + ' has connected');
        updateUser();
    });

    socket.on('new message', function (data){
        var username = data.username;
        var content = data.content;
        home.emit('display message', {username : username , content : content});
        contentChat.push([username , content]);
    })

    function updateUser() {
        home.emit('update users', { users: users });
        home.emit(''+socket.name +'' , {contentChat : contentChat});
    }

  

    // function loadContentChat (){
    //     console.log('is Loading...');
    //     for (var i = 0; i < contentChat.length ; i++){
    //         var arr = contentChat[i];
    //         for (var j = 0 ; j < arr.length ; j++)
    //         console.log(arr[j] + ' ' + arr[j]);
    //     }
    // }

});