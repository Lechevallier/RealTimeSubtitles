Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.header.helpers({
	isTeacher : function(){
		return ((CoursesCollection.findOne(Session.get('joinedCourse')).author == Meteor.userId()) && (Session.get('currentSlide') != undefined));
	},
	isJoined : function(){
		return CoursesCollection.find(Session.get('joinedCourse')).fetch().toString() != [];
	},
	courseName : function(){
		return CoursesCollection.findOne(Session.get('joinedCourse')).name;
	}
});