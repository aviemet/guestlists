import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { buildNameObject } from '../lib/utils';

const Groups = new Meteor.Collection('groups');

Meteor.methods({
	'Groups.insert'(title, domains, users){
		if(!this.userId){ throw new Meteor.Error('not-authorized'); }

		check(title, String);
		check(domains, Array);
		check(users, Array);

		let group = {
			title: title,
			creator: this.userId,
			createdAt: new Date(),
			authorized_domains: domains,
			authorized_users: users
		};

		return Groups.insert(group);
	}
});

export default Groups;