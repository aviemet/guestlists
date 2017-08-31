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
		]
	},
	{
		names: 0,
		sort: {date: 1} 
	});
});

Meteor.publish('past_lists', function(page, sort){
	page = page || 0;
	sort = sort || {date: -1};
	console.log(sort);
	var limit = Meteor.settings.public.limit;
	var skip = page * limit;
	
	let userId = this.userId;

	let User = Meteor.users.findOne({_id: userId});
	var shared_lists = !User.lists ? [] : User.lists.map(function(list){
		return list._id;
	});
	return Lists.find({
		date: {
			$lt: moment().startOf('day').subtract(1, 'second').toDate()
		},
		$or: [
			{creator: userId},
			{_id: {$in: shared_lists}}
		]
	},
	{
		names: 0,
		sort: sort,
		skip: skip,
		limit: limit
	});
});

Meteor.publish('past_lists.count', function(sort){
	let userId = this.userId;

	let User = Meteor.users.findOne({_id: userId});
	var shared_lists = !User.lists ? [] : User.lists.map(function(list){
		return list._id;
	});
	Counts.publish(this, 'past_lists.count', Lists.find({
		date: {
			$lt: moment().startOf('day').toDate()
		},
		$or: [
			{creator: userId},
			{_id: {$in: shared_lists}}
		]
	}));
});

Meteor.publish('list', function(listId){
	let userId = this.userId;

	let User = Meteor.users.findOne({_id: userId});
	var shared_lists = !User.lists ? [] : User.lists.map(function(list){
		return list._id;
	});
	return Lists.find({
		_id: listId,
		$or: [
			{creator: userId},
			{_id: {$in: shared_lists}}
		]
	});
});

Meteor.publish('users', function(){
	return Meteor.users.find({}, {sort: {email: 1}});
});

// Meteor.publish('groups', function(){
// 	return Groups.find({}, {sort: {createdAt: -1}});
// });
