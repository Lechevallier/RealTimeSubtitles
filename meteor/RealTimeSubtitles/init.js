	
CoursesCollection = new Mongo.Collection('courses');
SlidesCollection = new Mongo.Collection('slides');
WordsCollection = new Mongo.Collection('words');


// Meteor.call('insertSlideData', Session.get('joinedCourse'), 0, 0);
// puis
// Meteor.call('pushWordData', Session.get('selectedSlide'), "Bonjour");