import { Template } from 'meteor/templating';
import Lists from '../../collections/Lists.js';

import './GuestLists.html';

// GuestLists Template
Template.GuestLists.onCreated(function(){
	Meteor.subscribe('allLists');
	this.state = new ReactiveDict();
	// Ensure Session variable purity
	if(_.isEmpty(Session.get('sortLists')) || !Session.get('sortLists').hasOwnProperty('term') || !Session.get('sortLists').hasOwnProperty('descending')){
		Session.set('sortLists', {term: 'date', descending: false});
	}
});

// NewListForm Template
Template.GuestLists.rendered = function(){
	this.newListPicker = new Pikaday({ 
		field: document.getElementById('datepicker'),
		format: 'M/D/YY',
		minDate: moment().toDate(),
		defaultDate: moment().toDate(),
		setDefaultDate: moment().toDate()
	});
};

Template.GuestLists.helpers({
	lists(){	
		const instance = Template.instance();
		let session = Session.get('sortLists');
		var options = {sort: {[session.term]: session.descending ? -1 : 1}};
		
		if(instance.state.get('showPastEvents')){
			return Lists.find({}, options);
		}
		let today = moment().startOf('day').toDate();
		return Lists.find({date: { $gte: today}}, options);
	},
	past(date){
		let today = moment().startOf('day').toDate();
		return date < today;
	},
	canEdit(){
		return this.creator === Meteor.userId();
	},
	editing(id){
		const instance = Template.instance();
		return instance.state.get('editing') === this._id;
	}
});

Template.GuestLists.events({
	'change input#showPastEvents'(e, instance){
		instance.state.set('showPastEvents', e.target.checked);
	},
	
	'submit #newListForm'(e){
		event.preventDefault();
		
		const instance = Template.instance();
		
		const title = e.target.title.value;
		const date = instance.newListPicker.getDate();

		try{
			Meteor.call('Lists.insert', title, date);
		} catch(e){
			
		}

		e.target.title.value = "";
	},

	'click a.delete'(e){
		if(confirm('Are you sure?\nThis will permanently delete this event.')){
			let id = $(e.currentTarget).closest('tr').data('id');
			Meteor.call('Lists.remove', id);
		}
	},
	
	'click a.edit'(e){
		const instance = Template.instance();
		instance.state.set('editing', this._id);
	},
	
	'click button.accept, keyup input.title_input'(e){
		if(e.type === "keyup" && e.which !== 13) return false;
		
		const instance = Template.instance();
		
		let title = $(e.currentTarget).closest('tr').find('input.title_input').first().val();
		Meteor.call('Lists.updateTitle', this._id, title);
		console.log(instance.editListPicker.getDate());
		let date = instance.editListPicker.getDate();
		Meteor.call('Lists.updateDate', this._id, date);
		
		instance.state.set('editing', null);
	},
	
	'click button.cancel'(e){
		const instance = Template.instance();
		instance.state.set('editing', null);		
	},

	'click #guestListTable tr.editing td.date'(e, instance){
		if(!instance.editListPicker || !instance.editListPicker.isVisible()){
			instance.editListPicker = new Pikaday({
				field: $(e.currentTarget).find('input')[0],
				format: 'M/D/YY',
				defaultDate: moment(new Date($(e.currentTarget).find('input').data('value'))),
				setDefaultDate: true,
// 				onSelect: function(date) {
// 					let listId = $(e.currentTarget).closest('tr').data('id');
// 					Meteor.call('Lists.updateDate', listId, date);
// 				},
				onClose: function(){
					instance.editListPicker.destroy();
				}
			});
			instance.editListPicker.show();
		}
	},

	'click #guestListTable th.sortable'(e){
		let data = $(e.currentTarget).data('sort');
		let sort = Session.get('sortLists');

		if(sort.term === data){
			sort.descending = !sort.descending;
			Session.set('sortLists', sort);
		} else {
			sort = {term: data, descending: false};
			Session.set('sortLists', sort);
		}
	}
});
