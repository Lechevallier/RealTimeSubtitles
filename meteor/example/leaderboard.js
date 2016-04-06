if (Meteor.isClient) {

  Meteor.subscribe('thePlayers');
  /*
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });*/

  Template.leaderboard.helpers({
    player: function(){
      return PlayersList.find({}, {sort: {score: -1, name: 1} })
    },
    remove: function(){
      if(this._id == Session.get('mouseOverPlayer')){
        return "mouseOn"
      }
    },
    selectedClass: function(){
      if(this._id == Session.get('selectedPlayer')){
        return "selected"
      }
      if(this._id == Session.get('mouseOverPlayer')){
        return "mouseOn"
      }
    },
    'showSelectedPlayer': function(){
        return PlayersList.findOne(Session.get('selectedPlayer'));
    }
  });

  Template.leaderboard.events({
    'mouseover .player': function(){
      Session.set('mouseOverPlayer', this._id);
    },
    'click .player': function(){
      Session.set('selectedPlayer', this._id);
    },
    'click .increment': function(){
      playerNameVar = Session.get('selectedPlayer');
      Meteor.call('incrPlayerData', playerNameVar);
    },
    'click .remove': function(){
      playerNameVar = Session.get('selectedPlayer');
      Meteor.call('removePlayerData', playerNameVar)
    }
  });


  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      Meteor.call('insertPlayerData', event.target.playerName.value);
      event.target.playerName.value = "";
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('thePlayers', function(){
    return PlayersList.find()
  });

  Meteor.methods({
    'insertPlayerData': function(playerNameVar){
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: 0,
        createdBy: currentUserId
      });
    },
    'removePlayerData': function(playerNameVar){
      PlayersList.remove(playerNameVar);
    },
    'incrPlayerData': function(playerNameVar){
      PlayersList.update(playerNameVar, {$inc: {score: 5} });
    }
  });

}

PlayersList = new Mongo.Collection('players');