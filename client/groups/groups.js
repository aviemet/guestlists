import Groups from '../../collections/Groups.js';

import './Groups.html';

Template.Groups.onCreated(function(){
	Meteor.subscribe('groups');
});

Template.Groups.helpers({
	groups(){
		let groups = Groups.find({creator: Meteor.userId()}, {sort: {createdAt: 1}});
		return groups;
	},
	isOwner(){
		return this.creator === Meteor.userId();
	}
});

Template.Groups.events({
	'click #newGroupButton'(e){
		var title = $("#groupTitleInput").val();
		if(!_.isEmpty(title)){
			Meteor.call('Groups.new', title);
		}
	}
});