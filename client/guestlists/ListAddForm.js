import { Template } from 'meteor/templating';
import Lists from '../../collections/Lists.js';

import './ListAddForm.html';

// ListAddForm Template
Template.ListAddForm.onCreated(function(){
	Meteor.subscribe('allLists');
});

Template.ListAddForm.rendered = function(){
	this.newListPicker = new Pikaday({
		field: document.getElementById('datepicker'),
		format: 'M/D/YY',
		minDate: moment().toDate(),
		defaultDate: moment().toDate(),
		setDefaultDate: moment().toDate()
	});
};

Template.ListAddForm.events({
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
	}
});
