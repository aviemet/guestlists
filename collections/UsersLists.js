import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from '../lib/utils'

const UsersLists = new Meteor.Collection('users_lists');

Meteor.methods({
	'Lists.share'(listId, userId, role){
		check(listId, String);
		check(userId, String);
		check(role, String);

		UsersLists.insert({
			list_id: listId,
			user_id: userId,
			role: role
		});
	}
});

export default UsersLists;