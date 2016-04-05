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
		keyboard: true,
		showNotes:false,
		help: true,
		embedded:true,
		slideNumber: true,
		keyboard:{
			78:null,
			32:null,
			80:null,
			72:null,
			74:null,
			75:null,
			76:null,
			66:null,
			46:null,
			47:null,
			70:null,
			79:null,
			58:null,
			59:null,
			190:null,
			115:null,
			83:null,
			191:null,
			49:'togglePause',
			48:'fullscreen'
		}
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
		Meteor.call('insertSlideData', Session.get('joinedCourse'), Session.get('currentIndexH'), Session.get('currentIndexV'), function(){
			slide = SlidesCollection.findOne({numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')});
			Session.set('currentSlide', slide._id);
		});
	}else{
		Session.set('currentSlide', slide._id);
	}
}