Template.displayWord.onRendered(function(){
  this.$('.selectpicker').selectpicker();
});

var renderTimeout = false;
Template.displayWord.onRendered(function(){
  console.log('yo')
  if (renderTimeout !== false) {
    Meteor.clearTimeout(renderTimeout);
  }
  renderTimeout = Meteor.setTimeout(function() {
    console.log('yo')
    $('.selectpicker').selectpicker("refresh");
    renderTimeout = false;
  }, 100);
});


Template.displayWord.helpers({
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
  selectOrSpan: function(wordOptArray){
    return (wordOptArray.length>1);
  },
  addWordForm: function(idWord){
    return ((idWord == Session.get('selectedWord')) && (idWord == Session.get('mouseOverWord')) && (idWord != Session.get('insertWordForm')));
  },
  reinitialiseAddWordOpt: function(){
    Session.set('addWordForm', null);
  },
  reinitialiseAddWord: function(){
    Session.set('addWordForm', null);
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
})


Template.displayWord.events({
  'mouseover': function(){
    Session.set('mouseOverWord', this.var[0]);
  },
  'click': function(){
    console.log(this)
    Session.set('selectedWord', this.var[0]);
  },
  'submit form': function(event){
    event.preventDefault();
    if(event.target.addOptSelect != undefined){
      console.log(event.target.addOptSelect.value);
      Meteor.call('addOptWordData', Session.get('selectedSlide'), event.target.addOptSelect.value, Session.get('selectedWord'), function(result, error){$('.selectpicker').selectpicker('refresh')});
      event.target.addOptSelect.value = "";
    }
    else if(event.target.addWordOpt != undefined){
      console.log(event.target.addWordOpt.value);
      Meteor.call('addOptWordData', Session.get('selectedSlide'), event.target.addWordOpt.value, Session.get('addWordForm'), function(result, error){$('.selectpicker').selectpicker('refresh')});
      Session.set('addWordForm', null);
      event.target.addWordOpt.value = "";
    }
    else if(event.target.insertWord != undefined){
      console.log(event.target.insertWord.value);
      Meteor.call('insertWordData', Session.get('selectedSlide'), event.target.insertWord.value, Session.get('insertWordForm'), function(result, error){$('.selectpicker').selectpicker('refresh')});
      Session.set('insertWordForm', null);
      event.target.insertWord.value = "";
    }
    else{
      console.log("submit non reconnu... :/");
    }
    $('.selectpicker').selectpicker("refresh");
  },
  'click .close': function(event){
    console.log(event);
    var idWord = $('.selectpicker').find(":selected")[0].id;
    console.log(idWord);
    Meteor.call('removeWordData', idWord, function(result, error){console.log(result);$('.selectpicker').selectpicker('refresh')});
  },
})










Template.addWordOpt.events({
  'click form': function(){
    console.log(this.var[0]);
    Session.set('addWordForm', this.var[0]);
  },
})


Template.insertWord.helpers({
  insertWordForm: function(idWord){
    return ((idWord == Session.get('mouseOverWord')) && (Session.get('addWordForm')==null));
  },
  reinitialiseInsertWord: function(){
    Session.set('insertWordForm', null);
  }
})

Template.insertWord.events({
  'click form': function(){
    Session.set('insertWordForm', this.var[0]);
  },
})


Template.displayRemove.helpers({
  wordFromCurrentUser: function(idWord){
    return WordsCollection.findOne(idWord.toString()).author == Meteor.userId();
  },
})