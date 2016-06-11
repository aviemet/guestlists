import Lists from '../../collections/Lists.js';

import './GuestLists.html';

// GuestLists Template
Template.GuestLists.onCreated(function(){
	this.state = new ReactiveDict();
	Meteor.subscribe('allLists');
});

// NewListForm Template
Template.GuestLists.rendered = function(){
	this.newListPicker = new Pikaday({ 
		field: document.getElementById('datepicker'),
		format: 'MM/DD/YYYY',
		minDate: moment().toDate(),
		defaultDate: moment().toDate(),
		setDefaultDate: moment().toDate()
	});
};
 
Template.GuestLists.helpers({
	lists(){	
		const instance = Template.instance();
		
		if(instance.state.get('showPastEvents')){
			return Lists.find({}, {sort: {date: 1}});
		}
		let today = moment().startOf('day').toDate();
		return Lists.find({date: { $gte: today}}, {sort: {date: 1}});
	},
	past(date){
		let today = moment().startOf('day').toDate();
		return date < today;
	}
});

Template.GuestLists.events({
	'change input#showPastEvents'(e, instance){
		instance.state.set('showPastEvents', e.target.checked);
	},
	
	'submit #newListForm'(e){
		event.preventDefault();
		
		const title = e.target.title.value;
		const date = e.target.date.value;

		Meteor.call('Lists.insert', title, date);

		e.target.title.value = "";
	},

	'click a.delete'(e){
		if(confirm('Are you sure?\nThis will permanently delete this event.')){
			let id = $(e.currentTarget).closest('tr').data('id');
			Meteor.call('Lists.remove', id);
		}
	},

	'click #guestListTable td.date'(e, instance){
		if($(e.currentTarget).hasClass('pikaday')){

		} else {
			$(e.currentTarget).addClass('pikaday');
			instance.editListPicker = new Pikaday({
				field: $(e.currentTarget).find('input')[0],
				format: 'MM/DD/YYYY',
				bound: false,
				container: $(e.currentTarget).find('.pickerContainer'),
				onSelect: function(date) {
					let listId = $(e.currentTarget).closest('tr').data('id');
					Meteor.call('Lists.updateDate', listId, date);
					instance.editListPicker.destroy();
					$(e.currentTarget).removeClass('pikaday');
				}
			});
			instance.editListPicker.show();
			console.log({
				picker: instance.editListPicker,
				visible: instance.editListPicker.isVisible(),
				date: instance.editListPicker.getDate()
			});
		}
	}
});


