import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Lists } from '../collections/Lists.js';
 
import './guestlists/GuestLists.js';

BlazeLayout.setRoot('#wrapper');

// Global Helpers //
Template.registerHelper('formatDate', function(date) {
	return moment(date).format('M/D/YY');
});

Template.registerHelper('log', function(term){
	console.log(term);
});
