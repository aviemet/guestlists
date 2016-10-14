import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import 'foundation-sites/dist/foundation.js';

import { Lists } from '../collections/Lists.js';

import './guestlists/GuestLists.js';

BlazeLayout.setRoot('#wrapper');

// Global Helpers //
Template.registerHelper('formatDate', function(date) {
	return moment(date).format('M/D/YY');
});

Template.registerHelper('past', function(date){
	let today = moment().startOf('day').toDate();
	return date < today;
});

Template.registerHelper('log', function(term){
	console.log(term);
});

Meteor.startup(function() {
	Deps.autorun(function() {
		document.title = Session.get('document-title');
	});
});
