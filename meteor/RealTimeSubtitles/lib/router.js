Router.configure ({
	layoutTemplate:'home',
	loadingTemplate:'loading',
	//waitOn: function(){return Meteor.subscribe('/');}
});

Router.route('/', function () {
  this.render('navbar');
});