import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UUID } from '../lib/utils';

const Lists = new Meteor.Collection('lists');

Meteor.methods({
	'Lists.insert'(title, date){
		check(title, String);
		check(date, String);

		if(!this.userId){
			throw new Meteor.Error('not-authorized');
		}

		let record = Lists.insert({
			title: title,
			date: new Date(date),
			creator: this.userId,
			createdAt: new Date(),
			names: []
		});
	},
	'Lists.remove'(listId){
		check(listId, String);

		Lists.remove(listId);
	},
	'Lists.addName'(listId, name){
		check(listId, String);
		check(name, String);
		
		let nameObj = {
			id: UUID(),
			createdAt: new Date(),
			arrived: false,
			plus: 0
		}
	
		
		let plus = name.match(/(\d)/);
		if(plus){
			nameObj.plus = plus[0];
		}
		
		let matches = name.match(/([a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?),\s*([a-zA-Z'\.\-]+)(?:\s+([a-zA-Z'\.\-](?=\.)|[a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?))?|([a-zA-Z'\.\-]+)\s+(?:([a-zA-Z'\.\-](?=\.)|[a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?)\s+)?([a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?)/);
		nameObj.firstName = matches[2] || matches[4];
		nameObj.lastName = matches[1] || matches[6];

		console.log(nameObj);
		
		Lists.update({_id: listId}, {$push: {names: nameObj}});
	},
	'Lists.removeName'(listId, nameId){
		check(listId, String);
		check(nameId, String);
		console.log({nameId: nameId});

		Lists.update({_id: listId}, {$pull: {names: {id: nameId}}});
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
			"names.id": nameId
		}, {
			"$set": {
				'names.$.arrived': arrived
			}
		})
	}
});

export default Lists;