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
  thereIsSlide: function(slideTab){
    return SlidesCollection.find({course: Session.get('joinedCourse')}).fetch().toString() != [];
  },
  thereIsWord: function(notes){
    var notes = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')}).notes;
    return notes.toString() != [];
  }
})