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
    if((Meteor.users.findOne(id) != undefined) && (Meteor.users.findOne(id).username != undefined)){
      return Meteor.users.findOne(id).username;
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
    if(reco != undefined){
      console.log("stop")
      reco.stop();
    }
  }
});


Template.addCourseForm.events({
  'submit form': function(event){
    event.preventDefault();
    Meteor.call('insertCourseData', event.target.courseName.value);
    event.target.courseName.value = "";
  }
});