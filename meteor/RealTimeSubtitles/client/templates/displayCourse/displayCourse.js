Template.myCoursesTables.helpers({
  settings: function () {
      return {
        collection:CoursesCollection.find({author : Meteor.userId()}),
        rowsPerPage:7,
        showNavigation:'auto',
        noDataTmpl: Template.noCourse,
        fields: [
          {key:'name', label:'Name'},
          {key:'listener', label:'Listener'},
          {key:'createdAt', label:'Date', fn: function (value, object, key) { return moment(value).fromNow(); }, sortOrder: 0, sortDirection: -1},
          {label:'',tmpl: Template.actionCourse}
        ],
      };
  },
});

Template.coursesTables.helpers({
  courseCss: function(){
    if(this._id == Session.get('selectedCourse')){
      return "selected"
    }
    if(this._id == Session.get('mouseOverCourse')){
      return "mouseOn"
    }
  },
  settings: function () {
      return {
        collection:CoursesCollection.find({author : {$not : Meteor.userId()}}),
        rowsPerPage:7,
        showNavigation:'auto',
        noDataTmpl: Template.noCourse,
        fields: [
          {key:'name', label:'Name'},
          {key:'listener', label:'Listener'},
          {key:'createdAt', label:'Date', fn: function (value, object, key) { return moment(value).fromNow(); }, sortOrder: 0, sortDirection: -1},
          {key:'author', label:'Author', fn: function (value, object, key) { return Meteor.users.findOne(value).username; }},
          {label:'',tmpl: Template.actionCourse}
        ],
      };
  }
});

Template.myCoursesTables.events({
  'mouseover .reactive-table tbody tr': function(){
    Session.set('mouseOverCourse', this._id);
  },
  'click .reactive-table tbody tr': function(){
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

Template.coursesTables.events({
  'mouseover .reactive-table tbody tr': function(){
    console.log("over");
    Session.set('mouseOverCourse', this._id);
  },
  'click .reactive-table tbody tr': function(){
    console.log("selected");
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


Template.addCourseForm.helpers({
  'succWarnDangStyle': function(){
      if(Session.get("courseName") == "error"){
        return "has-error";
      }else if(Session.get("courseName") == "success"){
        return "has-success";
      }else{
        return "has-warning";
      }
  },
  'succWarnDangIcone': function(){
    if(Session.get("courseName") == "error"){
      return "glyphicon-remove";
    }else if(Session.get("courseName") == "success"){
      return "glyphicon-ok";
    }else{
      return "glyphicon-warning-sign";
    }
  },
  'succWarnDangText': function(){
    if(Session.get("courseName") == "error"){
      return "Name already taken";
    }else if(Session.get("courseName") == "success"){
      return "Name free";
    }else{
      return "Type a name between 5 and 20 characters";
    }
  }
});


Template.addCourseForm.events({
  'submit form': function(event){
    event.preventDefault();
    if(Session.get("courseName") == "success"){
      Meteor.call('insertCourseData', event.target.courseName.value);
      event.target.courseName.value = "";
    }
  },
  'keyup': function(event){
    if(4<event.target.value.length && event.target.value.length<20){
      Session.set("courseName", "success");
    }else{
      Session.set("courseName", "warning");
    }if(CoursesCollection.findOne({name : event.target.value}) != undefined){
      Session.set("courseName", "error");
    }
    console.log(Session.get("courseName"));
  }
});


Template.actionCourse.helpers({
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
});