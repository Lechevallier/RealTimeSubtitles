Template.reveal.onRendered( function() {
  Reveal.initialize({
  		width: 960,
  	    height: 700,

  	    // Factor of the display size that should remain empty around the content
  	    margin: 0.1,

  	    // Bounds for smallest/largest possible scale to apply to content
  	    minScale: 0.2,
  	    maxScale: 1.5,
		controls:true,
		showNotes:true,
		embedded:true,
		slideNumber: true,
  });
	Reveal.slide();
	Reveal.addEventListener( 'ready', function( event ) {
	    addSlide(event.indexh, event.indexv);
	});
	Reveal.addEventListener( 'slidechanged', function( event ) {
		addSlide(event.indexh, event.indexv);
	});
});




function addSlide(H, V){
	Session.set('currentIndexH',H);
	Session.set('currentIndexV',V);
	var slide = SlidesCollection.findOne({numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')});
	if(slide == undefined){
		console.log(Session.get('currentIndexH'))
		console.log(Session.get('currentIndexV'))
		Meteor.call('insertSlideData', Session.get('joinedCourse'), Session.get('currentIndexH'), Session.get('currentIndexV'), function(){
			slide = SlidesCollection.findOne({numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')});
			Session.set('currentSlide', slide._id);
		});
	}else{
		Session.set('currentSlide', slide._id);
	}
}