import { Meteor } from 'meteor/meteor';
import Lists from '../collections/Lists';
import Groups from '../collections/Groups';
import UsersGroups from '../collections/UsersGroups';
import UsersLists from '../collections/UsersLists';

Meteor.publish('allLists', function(){
	let userId = this.userId;
// 	let groups = UsersGroups.find({user_id: userId});
	
	let shares = UsersLists.find({user_id: userId}, {_id: 0, list_id: 1});
	var share_lists = shares.map(function(list){
		return list.list_id;
	});
	return Lists.find({
		$or: [
			{creator: userId},
			{user_id: {$in: share_lists}}
		]}, 
		{sort: {date: 1}
	}	);
});

Meteor.publish('groups', function(){
	return Groups.find({}, {sort: {createdAt: -1}});
});