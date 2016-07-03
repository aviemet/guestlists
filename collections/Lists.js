import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { buildNameObject } from '../lib/utils';

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
				'names.$.arrived': arrived
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
				'names.$.guests.expected': guests
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
				'names.$.guests.arrived': guests
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
				'names.$.guests.notes': note
			}
		});
	}
});

export default Lists;
