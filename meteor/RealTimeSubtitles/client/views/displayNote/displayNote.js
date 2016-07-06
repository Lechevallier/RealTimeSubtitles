Template.displayNote.onRendered(function(){
  // create bootstrap-switch - for all switch classes
  $('.switch')['bootstrapSwitch']();
  $('#toggle').bootstrapSwitch('setOnLabel', 'Edit');
  $('#toggle').bootstrapSwitch('setOffLabel', 'Read');
  $('#toggle').on('switch-change', function (event, data) {
    Session.set('isEditable', data.value);
  });
});



Template.displayNote.helpers({
  displayNote: function(){
    var notes = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')}).notes;
    return notes;
  },
  displayBestWord: function(wordOptArray){
    var best = WordsCollection.findOne(wordOptArray[0].toString());
    for(word of wordOptArray){
      if(WordsCollection.findOne(word.toString()).score >= best.score){
        best = WordsCollection.findOne(word.toString());
      }
    }
    return best.text;
  },
  multiple: function(wordOptArray){
    return (wordOptArray.length>1);
  },
  thereIsSlide: function(){
    return SlidesCollection.find({course: Session.get('joinedCourse')}).fetch().toString() != [];
  },
  thereIsWord: function(){
    var slide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')});
    if(slide != undefined){
      return slide.notes.toString() != [];
    }
    else{
      return false;
    }
  },
  isEditable: function(){
    return Session.get('isEditable') == true;
  },
  isTeacher: function(){
    return CoursesCollection.findOne(Session.get('joinedCourse')).author == Meteor.userId();
  },
})




Template.pushWordNoteSide.helpers({
  pushWordForm: function(slide){
    return (slide==Session.get('mouseOverSlide') && (Session.get('addWordForm')==null) && (Session.get('insertWordForm')==null));
  },
})

Template.pushWordNoteSide.events({
  'submit form': function(){
    event.preventDefault();
    var idSlide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')})._id;
    Meteor.call('pushWordData', idSlide, event.target.pushWordNoteSide.value);
    event.target.pushWordNoteSide.value = "";
  },
})