Template.displayWordNoteSide.onRendered(function(){
  $('select').material_select();
  Materialize.updateTextFields();
});

// var renderTimeout = false;
// Template.displayOption.onRendered(function(){
//   if (renderTimeout !== false) {
//     Meteor.clearTimeout(renderTimeout);
//   }
//   renderTimeout = Meteor.setTimeout(function() {
//     console.log('refresh')
//     $('.selectpicker').selectpicker("refresh");
//     renderTimeout = false;
//   }, 100);
// });



Template.displayWordNoteSide.helpers({
  displayWordCss: function(){
    if(this.var[0] == Session.get('selectedWord')){
      return "selectedWord"
    }
    if(this.var[0] == Session.get('mouseOverWord')){
      return "mouseOnWord"
    }
  },
  displayWord: function(idWord){
    return WordsCollection.findOne(idWord.toString()).text;
  },
  displayScore: function(idWord){
    return WordsCollection.findOne(idWord.toString()).score;
  },
  id: function(idWord){
    return WordsCollection.findOne(idWord.toString())._id;
  },
  selectOrSpan: function(wordOptArray){
    return (wordOptArray.length>1);
  },
  addWordForm: function(idWord){
    return ((idWord == Session.get('selectedWord')) && (idWord == Session.get('mouseOverWord')) && (idWord != Session.get('insertWordForm')));
  },
})


Template.displayWordNoteSide.events({
  'mouseover': function(){
    Session.set('mouseOverWord', this.var[0]);
  },
  'click': function(){
    Session.set('selectedWord', this.var[0]);
  },
  'submit form': function(event){
    event.preventDefault();
    if(event.target.addOptSelect != undefined){
      console.log(event.target.addOptSelect.value);
      var idSlide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')})._id;
      Meteor.call('addOptWordData', idSlide, event.target.addOptSelect.value, Session.get('selectedWord'));
      event.target.addOptSelect.value = "";
    }
    else if(event.target.addWordOpt != undefined){
      console.log(event.target.addWordOpt.value);
      var idSlide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')})._id;
      Meteor.call('addOptWordData', idSlide, event.target.addWordOpt.value, Session.get('selectedWord'));
      event.target.addWordOpt.value = "";
    }
    else if(event.target.insertWord != undefined){
      console.log(event.target.insertWord.value);
      var idSlide = SlidesCollection.findOne({course: Session.get('joinedCourse'), numH:Session.get('currentIndexH'), numV:Session.get('currentIndexV')})._id;
      Meteor.call('insertWordData', idSlide, event.target.insertWord.value, Session.get('insertWordForm'));
      Session.set('insertWordForm', null);
      event.target.insertWord.value = "";
    }
    else{
      console.log("submit non reconnu... :/");
    }
  },
  'click .close': function(event){
    var idWord = $('.selectpicker').find(":selected")[0].id;
    Meteor.call('removeWordData', idWord);
  },
  'change select': function(event){
    var idWord = $('.selectpicker').find(":selected")[0].id;
    Meteor.call('incWordScore', idWord);
  }
})