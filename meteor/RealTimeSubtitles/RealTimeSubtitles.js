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
        if((Meteor.users.findOne(id) != undefined) && (Meteor.users.findOne(id).emails != undefined)){
          return Meteor.users.findOne(id).emails[0].address;
        }else{
          return id;
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
    thereIsWord: function(notes){
      return notes.toString() != [];
    }
  });


  Template.displaySlide.events({
    'mouseover .displaySlide': function(){
      Session.set('mouseOverSlide', this._id);
    },
    'click .displaySlide': function(){
      Session.set('selectedSlide', this._id);
    },
  });


  Template.displayWord.onRendered(function(){
      this.$('.selectpicker').selectpicker();

  });

  var renderTimeout = false;
  Template.displayOption.onRendered(function(){
    if (renderTimeout !== false) {
      Meteor.clearTimeout(renderTimeout);
    }
    renderTimeout = Meteor.setTimeout(function() {
      console.log('yo')
      $('#my-select').selectpicker("refresh");
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


  Template.displayOption.helpers({

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

 Template.displayRemove.helpers({
  wordFromCurrentUser: function(idWord){
    return WordsCollection.findOne(idWord.toString()).author == Meteor.userId();
  },
 })

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
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide, author:Meteor.userId()});
        var tab = SlidesCollection.findOne(idSlide).notes;
        console.log(idWordDest);
        for(i=0; i<tab.length;i++){
          for(j=0; j<tab[i].length;j++){
            if(tab[i][j] == idWordDest){
              tab[i].push(idWordNewOpt);
            }
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
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide, author:Meteor.userId()});
        var tab = SlidesCollection.findOne(idSlide).notes;
        tab.forEach(function (words, index){
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
        var idWordNewOpt = WordsCollection.insert({text:textVar, score:100, slide:idSlide, author:Meteor.userId()});
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
    'removeSlideData': function(idSlide){
      if(idSlide!=undefined){
        var currentUserId = Meteor.userId();
        WordsCollection.remove({slide:idSlide});
        SlidesCollection.remove(idSlide);
      }else{
        console.log("Wrong idSlide "+idSlide);
      }
    },
    'removeWordData': function(idWord){
      if(idWord!=undefined){
        var idSlide = WordsCollection.findOne(idWord).slide;
        var tab = SlidesCollection.findOne(idSlide).notes;
        WordsCollection.remove(idWord);
        tab.forEach(function (words, indexI){
          words.forEach(function (word, indexJ){
            if(word.toString() == idWord.toString()){
              console.log(indexI);
              console.log(indexJ);
              tab[indexI].splice(indexJ, 1);
            }
          });
        });
        SlidesCollection.update(
          {_id: idSlide}, 
          {$set: {'notes': tab}}
        );
      }else{
        console.log("Wrong idWord "+idWord);
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