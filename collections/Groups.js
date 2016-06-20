import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { buildNameObject } from '../lib/utils';

const Groups = new Meteor.Collection('groups');

Meteor.methods({
	'Groups.new'(title){
		if(!this.userId){ throw new Meteor.Error('not-authorized'); }

		check(title, String);

		return Groups.insert({
			title: title,
			creator: this.userId,
			createdAt: new Date()
		});
	}
});

export default Groups;