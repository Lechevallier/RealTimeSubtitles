Template.displayWord.onRendered(function(){
  this.$('.selectpicker').selectpicker();
  console.log('()')
});

var renderTimeout = false;
Template.displayOption.onRendered(function(){
  if (renderTimeout !== false) {
    Meteor.clearTimeout(renderTimeout);
  }
  renderTimeout = Meteor.setTimeout(function() {
    console.log('refresh')
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
})


Template.displayWord.events({
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
      Meteor.call('addOptWordData', Session.get('selectedSlide'), event.target.addOptSelect.value, Session.get('selectedWord'));
      event.target.addOptSelect.value = "";
    }
    else if(event.target.addWordOpt != undefined){
      console.log(event.target.addWordOpt.value);
      Meteor.call('addOptWordData', Session.get('selectedSlide'), event.target.addWordOpt.value, Session.get('selectedWord'));
      event.target.addWordOpt.value = "";
    }
    else if(event.target.insertWord != undefined){
      console.log(event.target.insertWord.value);
      Meteor.call('insertWordData', Session.get('selectedSlide'), event.target.insertWord.value, Session.get('insertWordForm'));
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

Template.displayOption.helpers({
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





Template.addWordOpt.events({
  'click form': function(){
    console.log(this.var[0]);
  },
})

Template.insertWord.helpers({
  insertWordForm: function(idWord){
    return (idWord == Session.get('mouseOverWord'));
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