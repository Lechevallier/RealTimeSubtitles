Template.header.helpers({
	'isTeacher' : function(){
		return CoursesCollection.findOne(Session.get('joinedCourse')).author == Meteor.userId();
	}

})

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

