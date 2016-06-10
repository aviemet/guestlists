import Groups from '../../collections/Groups.js';

import './Groups.html';

Template.Groups.onCreated(function(){
	Meteor.subscribe('groups');
});

Template.Groups.helpers({
	myGroups(){
		return Groups.find({creator: Meteor.userId}, {sort: {createdAt: 1}});
	}
});