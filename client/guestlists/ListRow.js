import { Template } from 'meteor/templating';
import Lists from '../../collections/Lists.js';

import './ListRow.html';

Template.ListRow.onCreated(function(){
	// Subscribe to the DB
	Meteor.subscribe('lists');
	Session.set('editing', false);
});
Template.editing_row.onCreated(function(){
	// Subscribe to the DB
	Meteor.subscribe('allLists');
	// Init Template level storage
	this.state = new ReactiveDict();
});

Template.editing_row.rendered = function(){
	const instance = Template.instance();
	instance.editListPicker = new Pikaday({
		field: $('td.date input')[0],
		format: 'M/D/YY',
		setDefaultDate: true
	});
}

Template.display_row.helpers({
	canEdit(){
		return this.creator === Meteor.userId() || _.find(this.users, function(user){ return user._id == Meteor.userId() }).role < 2;
	}
});

Template.ListRow.helpers({
	editing(id){
		return Session.get('editing') === this._id;
	}
});


Template.editing_row.events({
	'click button.accept, keyup input.title_input'(e){
		if(e.type === "keyup" && e.which !== 13) return false;

		let title = $(e.currentTarget).closest('tr').find('input.title_input').first().val();
		Meteor.call('Lists.updateTitle', this._id, title);

		const instance = Template.instance();
		let date = instance.editListPicker.getDate();
		Meteor.call('Lists.updateDate', this._id, date);

		Session.set('editing', false);
	},

	'click button.cancel'(e){
		Session.set('editing', false);
	}
});

Template.display_row.events({
	'click a.delete'(e){
		if(confirm('Are you sure?\nThis will permanently delete this event.')){
			let id = this._id;
			Meteor.call('Lists.remove', id);
		}
	},

	'click a.edit'(e){
		Session.set('editing', this._id);
	},
});
