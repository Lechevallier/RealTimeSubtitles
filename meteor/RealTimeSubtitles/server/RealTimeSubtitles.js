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
      var idWordNewOpt = WordsCollection.insert({text:textVar, score:1, slide:idSlide, author:Meteor.userId()});
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
      var idWordNewOpt = WordsCollection.insert({text:textVar, score:0, slide:idSlide, author:Meteor.userId()});
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
      var idWordNewOpt = WordsCollection.insert({text:textVar, score:0, slide:idSlide, author:Meteor.userId()});
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
  'incWordScore': function(idWord){
    if(idWord!=undefined){
      WordsCollection.update(
        {_id: idWord}, 
        {$inc: {'score': 1}}
      );
    }else{
      console.log("Wrong idWord "+idCourse);
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