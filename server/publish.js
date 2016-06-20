import { Meteor } from 'meteor/meteor';
import Lists from '../collections/Lists.js';
import Groups from '../collections/Groups.js';

Meteor.publish('allLists', function(){
	return Lists.find({creator: this.userId}, {sort: {date: 1}});
});

Meteor.publish('groups', function(){
	return Groups.find({}, {sort: {createdAt: -1}});
});