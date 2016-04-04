Template.displaySlide.helpers({
  displaySlide: function(){
    var slidesTab = SlidesCollection.find({course: Session.get('joinedCourse')}).fetch();
    return slidesTab;
  },
  displaySlideCss: function(){
    if(this._id == Session.get('selectedSlide')){
      return "panel-primary"
    }
    if(this._id == Session.get('mouseOverSlide')){
      return "panel-info"
    }else{
      return "panel-default"
    }
  },
  thereIsSlide: function(slideTab){
    return SlidesCollection.find({course: Session.get('joinedCourse')}).fetch().toString() != [];
  },
  thereIsWord: function(notes){
    return notes.toString() != [];
  }
});


Template.displaySlide.events({
  'mouseover .panel': function(){
    Session.set('mouseOverSlide', this._id);
  },
  'click .panel': function(){
    Session.set('selectedSlide', this._id);
  },
});








Template.pushWord.helpers({
  pushWordForm: function(slide){
    return (slide==Session.get('mouseOverSlide') && (Session.get('addWordForm')==null) && (Session.get('insertWordForm')==null));
  },
})

Template.pushWord.events({
  'submit form': function(){
    event.preventDefault();
    Meteor.call('pushWordData', Session.get('selectedSlide'), event.target.pushWord.value);
    event.target.pushWord.value = "";
  },
})