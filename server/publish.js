import { Meteor } from 'meteor/meteor';
import Lists from '../collections/Lists';
// import Groups from '../collections/Groups';
// import UsersGroups from '../collections/UsersGroups';
// import UsersLists from '../collections/UsersLists';

Meteor.publish('lists', function(){
	let userId = this.userId;

	let User = Meteor.users.findOne({_id: userId});
	var shared_lists = !User.lists ? [] : User.lists.map(function(list){
		return list._id;
	});
	return Lists.find({
		date: { 
			$gte: moment().startOf('day').toDate()
		},
		$or: [
			{creator: userId},
			{_id: {$in: shared_lists}}
		]},
		{sort: {date: 1}
	}	);
});

Meteor.publish('past_lists', function(){
	let userId = this.userId;

	let User = Meteor.users.findOne({_id: userId});
	var shared_lists = !User.lists ? [] : User.lists.map(function(list){
		return list._id;
	});
	return Lists.find({
		date: { 
			$lte: moment().startOf('day').toDate()
		},
		$or: [
			{creator: userId},
			{_id: {$in: shared_lists}}
		]},
		{sort: {date: -1}
	}	);
});

Meteor.publish('users', function(){
	return Meteor.users.find({}, {sort: {email: 1}});
});

// Meteor.publish('groups', function(){
// 	return Groups.find({}, {sort: {createdAt: -1}});
// });
