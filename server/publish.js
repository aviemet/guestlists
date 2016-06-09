import { Meteor } from 'meteor/meteor';
import Lists from '../collections/Lists.js';

Meteor.publish('allLists', function(){
	return Lists.find({creator: this.userId}, {sort: {date: -1}});
});

