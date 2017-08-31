import { Template } from 'meteor/templating';
import Lists from '../../collections/Lists';

import './PastLists.html';

// GuestLists Template
Template.PastLists.onCreated(function(){	
	// Subscribe to the DB
  this.autorun(() => {
		var sort;
		if(Session.get('sortLists')){
			var sortObj = Session.get('sortLists');
			if(sortObj.term === 'date'){
				sort = {date: sortObj.descending ? -1 : 1};
			} else if(sortObj.term === 'title'){
				sort = {title: sortObj.descending ? -1 : 1};
			}
		}
	  Meteor.subscribe('past_lists', Session.get('page') - 1, sort);
  });
	// Init Template level storage
	this.state = new ReactiveDict();
	// Set sortable Session vars
	if(_.isEmpty(Session.get('sortLists')) || !Session.get('sortLists').hasOwnProperty('term') || !Session.get('sortLists').hasOwnProperty('descending')){
		Session.set('sortLists', {term: 'date', descending: false});
	}
});

Template.PastLists.helpers({
	lists(){
		// Set the sortable field and direction
		let session = Session.get('sortLists');
		var options = {sort: {[session.term]: session.descending ? -1 : 1}};

		// Fetch the lists
		return Lists.find({
			date: { 
				$lt: moment().startOf('day').subtract(1, 'second').toDate() 
			}}, $.extend({}, options));
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


Template.pagination.onCreated(function(){
	Meteor.subscribe('past_lists.count');
	// Set pagination variables
	Session.set('page', 1);
});

Template.pagination.helpers({
	listCount(){
		return Counts.get('past_lists.count');
	},
	totalPages(){
		return Math.ceil(Counts.get('past_lists.count') / Meteor.settings.public.limit);
	},
	page(test){
		// Just return the current page if no arguments
		if(typeof test == "undefined"){
			return Session.get('page');
		}
		// Otherwise an equality test
		return parseInt(test) === parseInt(Session.get('page'));
	},
	pageCount(){
		var pages = [];
		for(var i = 0; i < Math.ceil(Counts.get('past_lists.count') / Meteor.settings.public.limit); i++){
			pages.push(i+1);
		}
		return pages;
	},
	current(page){
		return page === Session.get('page') ? 'current': '';
	},
	previousDisabled(){
		return Session.get('page') === 1 ? 'disabled' : '';
	},
	nextDisabled(){
		return Session.get('page') === Math.ceil(Counts.get('past_lists.count') / Meteor.settings.public.limit) ? 'disabled' : '';
	}
});

Template.pagination.events({
	'click #previous'(e){
		let page = Session.get('page');
		if(page > 1){
			Session.set('page', page-1);
		}
	},
	'click #next'(e){
		let page = Session.get('page');
		let totalPages = Math.ceil(Counts.get('past_lists.count') / Meteor.settings.public.limit);
		console.log({page: page, totalPages: totalPages});
		if(page < totalPages){
			Session.set('page', page+1);
		}
	},
	'click .pagination-link'(e){
		let linkPage = $(e.currentTarget).data('page');
		let page = Session.get('page');
		if(linkPage !== page){
			Session.set('page', linkPage);
		}
	}
});




