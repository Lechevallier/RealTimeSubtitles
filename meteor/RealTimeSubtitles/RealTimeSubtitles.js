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
    }
  });

  Template.coursesTables.events({
    'mouseover .course': function(){
      Session.set('mouseOverCourse', this._id);
    },
    'click .course': function(){
      Session.set('selectedCourse', this._id);
    },
    'click .remove': function(){
      courseName = Session.get('mouseOverCourse');
      Meteor.call('removeCourseData', courseName);
    },
    'click .join': function(){
      Session.set('courseJoined', this._id);
    }
  });


  Template.addCourseForm.events({
    'submit form': function(event){
      event.preventDefault();
      Meteor.call('insertCourseData', event.target.courseName.value);
      event.target.courseName.value = "";
    }
  });


  Template.collaborator.helpers({
    display: function(){
      var slidesTab = SlidesCollection.find({cours: Session.get('selectedCourse')}).fetch();
      return slidesTab;
    },
    displayWordCss: function(){
      console.log(this._id+" "+Session.get('selectedWord'));
      if(this._id == Session.get('selectedWord')){
        return "selectedWord"
      }
      if(this._id == Session.get('mouseOverWord')){
        return "mouseOnWord"
      }
    },
    displaySlideCss: function(){
      if(this._id == Session.get('selectedSlide')){
        return "selected"
      }
      if(this._id == Session.get('mouseOverSlide')){
        return "mouseOn"
      }
    },
  });


  Template.collaborator.events({
    'mouseover .displayWord': function(){
      Session.set('mouseOverWord', this._id);
    },
    'click .displayWord': function(){
      Session.set('selectedWord', this._id);
    },
    'mouseover .displaySlide': function(){
      Session.set('mouseOverSlide', this._id);
    },
    'click .displaySlide': function(){
      Session.set('selectedSlide', this._id);
    }
  });

}









if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });



  Meteor.methods({
    'insertCourseData': function(courseNameVar){
      var currentUserId = Meteor.userId();
      var id = CoursesCollection.insert({
        name: courseNameVar,
        listener: 0,
        author: currentUserId
      });
      SlidesCollection.insert(
        {
          cours: id,
          numH:0,
          numV:0,
          notes:[
            {text:"Coucou", score:100, position:0},
            [{text:"ça", score:100},{text:"ta", score:100}],
            {text:"va?", score:100, position:2}
          ]
        });
      SlidesCollection.insert(
        {
          cours: id,
          numH:1,
          numV:0,
          notes:[
            {text:"oUI", score:100, position:0},
            {text:"et", score:100, position:1},
            {text:"toi?", score:100, position:2}
          ]
        });
    },
    'removeCourseData': function(courseNameVar){
      var currentUserId = Meteor.userId();
      CoursesCollection.remove({_id: courseNameVar, author: currentUserId});
    }
  });

}

CoursesCollection = new Mongo.Collection('courses');
SlidesCollection = new Mongo.Collection('slides');


// SlidesCollection.insert({
//   numH: 1,
//   numV: 2,
//   notes:{ 1 : {mot: "Bonjour", score: 100},
//           2 : {mot: "ceci", score: 100},
//           3 : {mot: "est", score: 100},
//           4 : {mot: "le", score: 100},
//           5 :{{mot: "cours", score: 50},{mot: "tours", score: 50}},
//           6 : {mot: "de", score: 100},
//           7 : {mot: "java", score: 100},
//   }
// });