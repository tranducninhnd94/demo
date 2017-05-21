exports.homepage = function(req, res){
	// res.sendfile("views/home.html",{ myVar: req.user.username });
	console.log('session'+ JSON.stringify( req.session));
	res.render("home.html",{ myVar: req.user.username });
}