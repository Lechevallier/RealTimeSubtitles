Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.header.helpers({
	'isTeacher' : function(){
		return CoursesCollection.findOne(Session.get('joinedCourse')).author == Meteor.userId();
	},
	'isJoined' : function(){
		return CoursesCollection.find(Session.get('joinedCourse')).fetch().toString() != [];
	}

});

