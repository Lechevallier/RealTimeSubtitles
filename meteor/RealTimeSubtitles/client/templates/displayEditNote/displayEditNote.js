Template.displayNote.helpers({
  displayNote: function(){
    var notes = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')}).notes;
    return notes;
  },
})



Template.pushWordEdit.helpers({
  pushWordForm: function(){
    var idSlide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')})._id;
    return (idSlide==Session.get('mouseOverSlide') && (Session.get('addWordForm')==null) && (Session.get('insertWordForm')==null));
  },
})

Template.pushWordEdit.events({
  'submit form': function(){
    event.preventDefault();
    Meteor.call('pushWordData', Session.get('selectedSlide'), event.target.pushWord.value);
    event.target.pushWord.value = "";
  },
})