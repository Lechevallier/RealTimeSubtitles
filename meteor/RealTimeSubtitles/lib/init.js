	
CoursesCollection = new Mongo.Collection('courses');
SlidesCollection = new Mongo.Collection('slides');
WordsCollection = new Mongo.Collection('words');
// FS.debug = true;
var docStore = new FS.Store.GridFS('docs', {path: "~/uploads"});

Docs = new FS.Collection('docs', {
 stores: [docStore]
});


Docs.deny({
 insert: function(){
 return false;
 },
 update: function(){
 return false;
 },
 remove: function(){
 return false;
 },
 download: function(){
 return false;
 }
 });

Docs.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});

