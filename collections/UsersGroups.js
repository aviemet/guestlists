import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from '../lib/utils'


const UsersGroups = new Meteor.Collection('users_groups');

Meteor.methods({
	'Users.joinGroup'(userId, groupId, role){
		check(userId, String);
		check(groupId, String);
		check(role, String);

		let rows = UsersGroups.find({
			userId: userId,
			groupId: groupId
		});

		if(rows.count <= 0){
			if(_.indexOf(Roles, role) < 0){
				role = 'basic';
			}

			return UsersGroups.insert({
				userId: userId,
				groupId: groupId,
				role: basic
			});
		}

		return false;
	},

	'Users.leaveGroup'(userId, groupId){
		check(userId, String);
		check(groupId, String);		

		let row = UsersGroups.findOne({
			userId: userId,
			groupId: groupId
		}, {
			fields: {
				_id: true
			}
		});

		return UsersGroups.remove(row._id);
	}
});