if (Meteor.isClient) {


  Template.coursesTables.helpers({
    course: function(){
      return CoursesCollection.find({})
    },
    mouseOnJoin: function(){
      if(this._id == Session.get('mouseOverCourse')) {
        return "mouseOn"
      }
    },
    mouseOnDelete: function(){
      if(((this.author == Meteor.userId())) && (this._id == Session.get('mouseOverCourse'))) {
        return "mouseOn"
      }
    },
    courseCss: function(){
      if(this._id == Session.get('selectedCourse')){
        return "selected"
      }
      if(this._id == Session.get('mouseOverCourse')){
        return "mouseOn"
      }
    },
    DisplayDate: function(date) {
        if(date)
          return moment(date).fromNow();
    },
    DisplayAuthor: function(id) {
        if(Meteor.users.find(id).fetch().toString() != []){
          return Meteor.users.find(id).fetch()[0].emails[0].address;
        }
    }
  });

  Template.coursesTables.events({
    'mouseover .course': function(){
      Session.set('mouseOverCourse', this._id);
    },
    'click .course': function(){
      Session.set('selectedCourse', this._id);
    },
    'click #remove': function(){
      currentCourse = Session.get('mouseOverCourse');
      Meteor.call('removeCourseData', currentCourse);
    },
    'click #join': function(){
      Session.set('joinedCourse', this._id);
      Meteor.call('incCourseListener', Session.get('joinedCourse'));
    }
  });


  Template.addCourseForm.events({
    'submit form': function(event){
      event.preventDefault();
      Meteor.call('insertCourseData', event.target.courseName.value);
      event.target.courseName.value = "";
    }
  });


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
    thereIsWord: function(slide){
      return slide[0].notes.toString() != [];
    }
  });


  Template.displaySlide.events({
    'mouseover #displaySlide': function(){
      Session.set('mouseOverSlide', this._id);
    },
    'click #displaySlide': function(){
      Session.set('selectedSlide', this._id);
    }
  });


  Template.displayWord.onRendered(function() {
      this.$('.selectpicker').selectpicker();
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
    displayScore: function(idWord){
      return WordsCollection.findOne(idWord.toString()).score;
    },
    selectOrSpan: function(wordOptArray){
      return (wordOptArray.length>1);
    },
    addOpt: function(idWord){
      return ((idWord == Session.get('wordToAddOpt')) && (idWord == Session.get('mouseOverWord')) && (idWord != Session.get('addWordForm')));
    },
    reinitialiseAddWordOpt: function(){
      Session.set('wordToAddOpt', null);
    }
  })

  Template.displayWord.events({
    'mouseover': function(){
      Session.set('mouseOverWord', this.var[0]);
    },
    'click': function(){
      Session.set('selectedWord', this.var[0]);
      Session.set('wordToAddOpt', this.var[0]);
    },
    'dblclick': function(){
      Session.set('dblclickWord', this.var[0]);
    },
  })


 Template.addWordOpt.events({
  'submit form': function(event){
    event.preventDefault();
    Meteor.call('addOptWordData', Session.get('selectedSlide'), event.target.addOpt.value, Session.get('wordToAddOpt'));
    event.target.addOpt.value = "";
  },
 })


 Template.addWord.helpers({
    addWordButton: function(idWord){
      return ((idWord == Session.get('mouseOverWord')) && (idWord != Session.get('addWordForm')));
    },
    addWordForm: function(idWord){
      return ((idWord == Session.get('addWordForm')) && (idWord == Session.get('mouseOverWord')));
    },
    wordBefore: function(idWord){
      Session.set('wordBefore', idWord);
    },
    reinitialiseAddWord: function(){
      Session.set('addWordForm', null);
      Session.set('wordToAddOpt', null);
    }
 })

 Template.addWord.events({
  'click #addWordButton': function(){
    Session.set('addWordForm', Session.get('wordBefore').toString());
  },
  'submit form': function(){
    event.preventDefault();
    Meteor.call('insertWordData', Session.get('selectedSlide'), event.target.addWord.value, Session.get('addWordForm'));
    event.target.addWord.value = "";
    Session.set('addWordForm', null);
  },
 })


  Template.pushWord.helpers({
    pushWordButton: function(slide){
      return (slide==Session.get('mouseOverSlide') && !Session.get('pushWordForm'));
    },
    pushWordForm: function(slide){
      return (slide==Session.get('mouseOverSlide') && Session.get('pushWordForm'));
    },
 })

 Template.pushWord.events({
  'click #pushWordButton': function(){
    Session.set('pushWordForm', true);
  },
  'submit form': function(){
    event.preventDefault();
    Meteor.call('pushWordData', Session.get('selectedSlide'), event.target.pushWord.value);
    event.target.pushWord.value = "";
    Session.set('pushWordForm', false);
  },
 })

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

}

// arr.splice(1, 0, "dAVID");


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });



  Meteor.methods({
    'insertCourseData': function(courseNameVar){
      if(courseNameVar!=""){
        var currentUserId = Meteor.userId();
        var idCourse = CoursesCollection.insert({
          name: courseNameVar,
          listener: 0,
          author: currentUserId,
          createdAt: new Date()
        });
      }else{
        console.log("Course name empty");
      }
    },
    'insertSlideData': function(idCourse, numHVar, numVVar){
      if(idCourse!=undefined){
        var idSlide = SlidesCollection.insert(
        {
          course: idCourse,
          numH:numHVar,
          numV:numVVar,
          notes:[]
        });
      }else{
        console.log("Wrong idCourse: "+idCourse);
      }
    },
    'addOptWordData': function(idSlide, textVar, idWordDest){
      if((idSlide!=undefined) && (idWordDest!=undefined)){
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide});
        var tab = SlidesCollection.findOne(idSlide).notes;
        for(i=0; i<tab.length;i++){
          if(tab[i] == idWordDest){
            tab[i].push(idWordNewOpt);
          }
        }
        SlidesCollection.update(
          {_id: idSlide}, 
          {$set: {'notes': tab}}
        );
      }else{
        console.log("Wrong idSlide "+idSlide+" or idWordDest "+idWordDest);
      }
    },
    'insertWordData': function(idSlide, textVar, idWordDest){
      if((idSlide!=undefined) && (idWordDest!=undefined)){
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide});
        var tab = SlidesCollection.findOne(idSlide).notes;
        tab.forEach(function (words, index) {
          for(idWord of words){
            if(idWord == idWordDest){
              SlidesCollection.update(
                {_id: idSlide}, 
                {$push: {'notes': {$each: [[idWordNewOpt]], $position: index}}}
              );
              break;
            }
          }
        });
      }else{
        console.log("Wrong idSlide "+idSlide+" or idWordDest "+idWordDest);
      }
    },
    'pushWordData': function(idSlide, textVar){
      if(idSlide!=undefined){
        var currentUserId = Meteor.userId();
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide, author:currentUserId});
        SlidesCollection.update(
          {_id: idSlide}, 
          {$push: {'notes': [idWordNewOpt]}}
        );
      }else{
        console.log("Wrong idSlide "+idSlide);
      }
    },
    'incCourseListener': function(idCourse){
      if(idCourse!=undefined){
        CoursesCollection.update(
          {_id: idCourse}, 
          {$inc: {'listener': 1}}
        );
      }else{
        console.log("Wrong idCourse "+idCourse);
      }
    },
    'removeCourseData': function(idCourse){
      if(idCourse!=undefined){
        var currentUserId = Meteor.userId();
        var tab = SlidesCollection.find({course: idCourse}).fetch();
        for(slide of tab){
          WordsCollection.remove({slide:slide._id});
        }
        SlidesCollection.remove({course: idCourse});
        CoursesCollection.remove({_id: idCourse, author: currentUserId});
      }else{
        console.log("Wrong idCourse "+idCourse);
      }
    },
  });

}

CoursesCollection = new Mongo.Collection('courses');
SlidesCollection = new Mongo.Collection('slides');
WordsCollection = new Mongo.Collection('words');


// Meteor.call('insertSlideData', Session.get('joinedCourse'), 0, 0);
// puis
// Meteor.call('pushWordData', Session.get('selectedSlide'), "Bonjour");