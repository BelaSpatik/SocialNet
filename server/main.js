import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Accounts.onCreateUser((options, user) => {
  //make sure that the user has a profile object
  user.profile = user.profile || {};
  //initiate follow to keep track of who they follow
  user.profile.follow = [];

  return user;

});

Post = new Mongo.Collection("post");

Meteor.methods({

  addPost: function(content) {

    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized", "you are not logged in");
    }

    var username = Meteor.user().username;
    
    Post.insert ({content: content, 
      created: new Date(),
      username: username
    });
  },
  
  follow: function(post) {

    //get current user
    var user = Meteor.user();

    if(!user) {
      throw new Meteor.Error("not-authorized", "you are not logged in");
    }

    //you can't follow yourself
    //you can't follow someone twice

    if(user.username != post.username && user.profile.follow.indexOf(post.username) == -1) {
      Meteor.users.update(
        {_id: user._id},
        {$push: {"profile.follow": post.username}
      })
    }
  }
});
