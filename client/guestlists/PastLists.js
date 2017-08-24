import { Template } from 'meteor/templating';
import Lists from '../../collections/Lists';

import './PastLists.html';

// GuestLists Template
Template.PastLists.onCreated(function(){
	// Subscribe to the DB
  this.autorun(() => {
	  Meteor.subscribe('past_lists');
  });
	// Init Template level storage
	this.state = new ReactiveDict();
	// Set sortable Session vars
	if(_.isEmpty(Session.get('sortLists')) || !Session.get('sortLists').hasOwnProperty('term') || !Session.get('sortLists').hasOwnProperty('descending')){
		Session.set('sortLists', {term: 'date', descending: true});
	}
});

Template.PastLists.helpers({
	lists(){
		// Set the sortable field and direction
		const instance = Template.instance();
		let session = Session.get('sortLists');
		var options = {sort: {[session.term]: session.descending ? -1 : 1}};

		// Fetch the lists
		return Lists.find({date: {$lte: moment().startOf('day').toDate()}}, options);
	}
});

Template.PastLists.events({
	'change input#showPastEvents'(e, instance){
		instance.state.set('showPastEvents', e.target.checked);
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
