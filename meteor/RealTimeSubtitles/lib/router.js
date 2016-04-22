Router.configure ({
	layoutTemplate:'layout',
	loadingTemplate:'loading',
	notFoundTemplate: 'notFound',
	//waitOn: function(){return Meteor.subscribe('/reveal');}
});

Router.route('/', function (){
  this.render('accueil');
});

Router.route('accueil',function(){
    this.render('accueil');
});

Router.route('/about',function(){
	this.render('about');
});

Router.route('/edit',function(){
    this.render('displaySlide');
});

Router.route('myCourse',function(){
		this.render('myCourse');
});

Router.route('/login',function(){
  this.render('login');
});


Router.route('/indev',function(){
  this.render('indev');
});

Router.route('/home',function(){
  this.render('home');
});


/*
Router.route('reveal',function(){
		this.render('reveal');
});*/


Router.map(function () {
  this.route('reveal', {
    path: '/reveal',
    template: 'reveal',
    layoutTemplate: 'layout',
    yieldTemplates: {
      'cours': {to: 'diapo'},
  	  'displayNote':{to:'commentaire'},	  
    }
  });
});
