
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


