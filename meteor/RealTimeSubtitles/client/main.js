if (Meteor.isClient) {
	Meteor.startup(function() {

	  Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
	});
}