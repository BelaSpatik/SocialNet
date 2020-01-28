import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Post = new Mongo.Collection("post");

Template.profileArea.helpers ({
  following: function() {
    var user = Meteor.user();
    return user.profile.follow;
  },

  followers: function() {
    var user = Meteor.user();
    var followers = Meteor.users.find({"profile.follow": {$in: [user.username]}});
    console.log(followers.fetch());
    return followers;
  }
});

Template.profileArea.events ({
  "click .filter-user": function() {
    event.preventDefault();
    var selectedUser = event.target.text;
      Session.set("username", selectedUser);  
    },
    "click .community": function() {
      event.preventDefault();
      Session.set("username", null);
    }
});

Template.postsForm.events ({
  'submit form': function(event) {
    event.preventDefault();

    var content = document.getElementById('content-desk').value;

    //call method
    Meteor.call("addPost", content);
 
    event.target.reset();
  }  
});

Template.postsList.helpers({
  posts: function() {

    var result;
    if(Session.get("username")) {
      result = Post.find({username: Session.get("username")}, {sort: {created: -1}});
    }
    else {
      return Post.find({}, {sort: {created: -1}});
    }
    return result;;
  }
});

Template.postsList.events ({
  "click .follow-link": function(event) {
    event.preventDefault();

    Meteor.call("follow", this);
  },
  "click .filter-link": function(event) {
    event.preventDefault();
    var selectedUser = event.target.text;
    Session.set("username", selectedUser);
    }
});
   


  
