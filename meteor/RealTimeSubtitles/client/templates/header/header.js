Template.header.helpers({
	'isTeacher' : function(){
		return CoursesCollection.findOne(Session.get('joinedCourse')).author == Meteor.userId();
	}

})