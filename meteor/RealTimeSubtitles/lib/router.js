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

Router.route('home',function(){
		this.render('home');
});

Router.route('/login',function(){
  this.render('login');
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
      'commentaire':{to:'commentaire_section'},
    }
  });
});
