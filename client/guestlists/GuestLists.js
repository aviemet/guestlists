import Lists from '../../collections/Lists.js';

import './GuestLists.html';

// Global Helpers //
Template.registerHelper('formatDate', function(date) {
	return moment(date).format('MM/DD/YYYY');
});

// GuestLists Template
Template.GuestLists.onCreated(function(){
	this.state = new ReactiveDict();
	Meteor.subscribe('allLists');
});
 
Template.GuestLists.helpers({
	lists(){	
		const instance = Template.instance();
		
		if(instance.state.get('showPastEvents')){
			return Lists.find({});
		}
		let today = moment().startOf('day').toDate();
		return Lists.find({date: { $gte: today}});
	}
});

Template.GuestLists.events({
	'change input#showPastEvents'(e, instance){
		instance.state.set('showPastEvents', e.target.checked);
	}
});

// NewListForm Template
Template.newListForm.rendered = function(){
	var picker = new Pikaday({ 
		field: document.getElementById('datepicker'),
		format: 'MM/DD/YYYY',
		minDate: moment().toDate(),
		defaultDate: moment().toDate(),
		setDefaultDate: moment().toDate()
	});
};

Template.newListForm.events({
	'submit #newListForm'(e){
		event.preventDefault();
		
		const title = e.target.title.value;
		const date = e.target.date.value;
		console.log({title: title, date: date});
		Meteor.call('Lists.insert', title, date);

		e.target.title.value = "";
	}
});


