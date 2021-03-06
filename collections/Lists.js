import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { buildNameObject, Roles, Matches } from '../lib/utils';

const Lists = new Meteor.Collection('lists');

Meteor.methods({
	'Lists.insert'(title, date){
		check(title, String);
		check(date, Date);

		if(!this.userId){
			throw new Meteor.Error('not-authorized');
		}

		if(_.isEmpty(title)){
			throw new Meteor.Error('invalid-input');
		}

		let record = Lists.insert({
			title: title,
			date: date,
			creator: this.userId,
			createdAt: new Date(),
			names: []
		});
		return record;
	},
	'Lists.updateTitle'(listId, title){
		check(listId, String);
		check(title, String);

		Lists.update({_id: listId}, {$set: {title: title}});
	},
	'Lists.updateDate'(listId, date){
		check(listId, String);
		check(date, Date);

		Lists.update({_id: listId}, {$set: {date: date}});
	},
	'Lists.remove'(listId){
		check(listId, String);

		Lists.remove(listId);
	},
	'Lists.addName'(listId, name){
		check(listId, String);
		check(name, String);

		let nameObj = buildNameObject(name);

		Lists.update({_id: listId}, {$push: {names: nameObj}});
	},
	'Lists.bulkAddNames'(listId, names){
		check(listId, String);
		check(names, Array);

		Lists.update({_id: listId}, {$addToSet: {names: {$each: names}}});
	},
	'Lists.removeName'(listId, nameId){
		check(listId, String);
		check(nameId, String);

		Lists.update({_id: listId}, {$pull: {names: {_id: nameId}}});
	},
	'Lists.removeAllNames'(listId){
		check(listId, String);

		Lists.update({_id: listId}, {$set: {names: []}});
	},
	'Lists.setArchived'(listId, setArchived){
		check(listId, String);
		check(setArchived, Boolean);

		Lists.update(listId, { $set: { archived: setArchived } });
	},
	'Lists.toggleNameArrived'(listId, nameId, arrived){
		check(listId, String);
		check(nameId, String);
		check(arrived, Boolean);

		Lists.update({
			"_id": listId,
			"names._id": nameId
		}, {
			"$set": {
				"names.$.arrived": arrived
			}
		})
	},
	'Lists.updateExpectedGuests'(listId, nameId, guests){
		check(listId, String);
		check(nameId, String);
		check(guests, Number);

		Lists.update({
			"_id": listId,
			"names._id": nameId
		}, {
			"$set": {
				"names.$.guests.expected": guests
			}
		});
	},
	'Lists.updateArrivedGuests'(listId, nameId, guests){
		check(listId, String);
		check(nameId, String);
		check(guests, Number);

		Lists.update({
			"_id": listId,
			"names._id": nameId
		}, {
			"$set": {
				"names.$.guests.arrived": guests
			}
		});
	},
	'Lists.updateName'(listId, nameId, name){
		check(listId, String);
		check(nameId, String);
		check(name, Object);

		var set = {"$set": {}}
		_.each(name, function(val, key){
			set.$set['names.$.'+key] = val;
		});
		Lists.update({ "_id": listId, "names._id": nameId }, set);
	},
	'Lists.setNotes'(listId, nameId, note){
		check(listId, String);
		check(nameId, String);
		check(note, String);

		Lists.update({
			"_id": listId,
			"names._id": nameId
		}, {
			"$set": {
				"names.$.guests.notes": note
			}
		});
	},

	'User.shareList'(userId, listId, role){
		check(userId, String);
		check(listId, String);
		check(role, Matches.isRole);

		let User = Meteor.users.findOne({_id: userId}, {fields: {'services.google.name': 1, 'services.google.email': 1}});
		let List = Lists.findOne({_id: listId}, {fields: {title: 1}});

		Lists.update({
			"_id": listId
		}, {
			"$addToSet": {
				"users": {_id: userId, role: role, email: User.services.google.email, name: User.services.google.name}
			}
		});

		Meteor.users.update({
			"_id": userId
		}, {
			"$addToSet": {
				"lists": {_id: listId, role: role, title: List.title}
			}
		});
	},

	'User.unshareList'(userId, listId){
		check(userId, String);
		check(listId, String);

		Lists.update({
			"_id": listId
		}, {
			"$pull": {
				"users": {_id: userId}
			}
		});

		Meteor.users.update({
			"_id": userId
		}, {
			"$pull": {
				"lists": {_id: listId}
			}
		});

	},
	
	'User.updateListRole'(userId, listId, role){
		check(userId, String);
		check(listId, String);
		check(role, Number);
		
		Lists.update({
			"_id": listId,
			"users._id": userId
		}, {
			"$set": {
				"users.$.role": role
			}
		});

		Meteor.users.update({
			"_id": userId,
			"lists._id": listId
		}, {
			"$set": {
				"lists.$.role": role
			}
		});
	}
});

export default Lists;
