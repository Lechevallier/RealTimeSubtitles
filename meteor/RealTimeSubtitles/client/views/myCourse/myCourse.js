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

    var name = $('input[name="courseName"]').val();
    var files = $('.myFileInput').prop('files');
    if(Session.get("courseName") == "success" && files.length != 0){
      for (var i = 0, ln = files.length; i < ln; i++) {
        Docs.insert(files[i], function (err, fileObj) {
          Meteor.call('insertCourseData', name, fileObj._id);
        });
      }
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
  },
  'change .myFileInput': function(event, template) {
    var files = event.target.files;
    console.log(files);
  },
});





Template.myCoursesTables.helpers({
  settings: function () {
      return {
        collection:CoursesCollection.find({author : Meteor.userId()}),
        rowsPerPage:7,
        showNavigation:'auto',
        noDataTmpl: Template.noCourse,
        fields: [
          {key:'name', label:'Name'},
          {key:'file', label:'File',fn: function (value, object, key) { return Docs.find(object.file).fetch()[0].original.name; }},
          {key:'listener', label:'Listener'},
          {key:'createdAt', label:'Date', fn: function (value, object, key) { return moment(value).fromNow(); }, sortOrder: 0, sortDirection: -1},
          {label:'',tmpl: Template.actionCourse}
        ],
      };
  },
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
    console.log(CoursesCollection.findOne(currentCourse));
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
  test: function(yo){
    console.log(yo);
  }
});