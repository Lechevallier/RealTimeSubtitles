if (Meteor.isClient) {
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
      selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5} });
    },
    'click .remove': function(){
      selectedPlayer = Session.get('selectedPlayer');
      PlayersList.remove(selectedPlayer);
    }
  });


  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      PlayersList.insert({name : event.target.playerName.value, score : 0});
      event.target.playerName.value = "";
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

PlayersList = new Mongo.Collection('players');