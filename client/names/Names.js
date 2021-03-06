import Lists from '../../collections/Lists.js';
import { stringToTerms } from '../../lib/utils';
import 'sticky-table-headers';

import './Names.html';

Template.Names.onCreated(function(){
	let listId = FlowRouter.getParam("listId");
	this.autorun(() => {
		Meteor.subscribe('list', listId, function(){
			// Set Document Title
			let ListName = Lists.findOne({_id: listId}).title;
			Session.set('document-title', ListName + ' | Guest Lists');
		});
	});

	this.state = new ReactiveDict();
	this.state.set('editingTitle', false);

	Session.set('showArrivedGuests', true);

	// Ensure Session variable purity (for some reason)
	if(_.isEmpty(Session.get('sortNames')) ||
		!Session.get('sortNames').hasOwnProperty('term') ||
		!Session.get('sortNames').hasOwnProperty('descending')){

		Session.set('sortNames', {term: 'firstName', descending: true});
	}
});

Template.Names.rendered = function(){
	$('#namesTable').stickyTableHeaders();
};

Template.Names.helpers({
	list(){
		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId});
		return list;
	},
	names(){
		const instance = Template.instance();

		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId}, {fields: {names: 1}});

		var filter = Session.get('filterQuery');
		var showArrivedGuests = Session.get('showArrivedGuests');

		if(filter !== "" || !showArrivedGuests){
			var pattern = stringToTerms(filter);
			var regex = new RegExp(pattern, 'i');

			// Filter results by search terms
			list.names = _.filter(list.names, function(name){
				if(!showArrivedGuests && name.arrived) return false;
				return regex.test(name.firstName.tokenize()+" "+name.lastName.tokenize());
			});
		}

		let names = _.sortBy(list.names, Session.get('sortNames').term);
		return Session.get('sortNames').descending ? names : names.reverse();
	},
	editingTitle(){
		const instance = Template.instance();
		return instance.state.get('editingTitle');
	},
	arrivedCount(){
		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId});

		var count = 0;
		if(list){
			_.each(list.names, function(el){
				if(el.arrived) count++;
				count += el.guests.arrived;
			});
		}
		return count;
	},
	totalCount(){
		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId});

		var count = 0;
		if(list){
			_.each(list.names, function(el){
				count++;
				count += parseInt(el.guests.expected);
			});
		}
		return count;
	},
	showArrivedChecked(){
		return Session.get('showArrivedGuests') ? 'checked' : '';
	}
});

Template.Names.events({

	'click #deleteAllNames'(e){
		let count = parseInt($(".count .total").html());
		if(count > 0 && confirm('Are you sure?\nThis will delete all names on this list')){
			let listId = FlowRouter.getParam("listId");
			Meteor.call('Lists.removeAllNames', listId);
		}
	},

	'click #listTitle'(e){
		const instance = Template.instance();

		instance.state.set('editingTitle', true);

		setTimeout(function(){
			$("#listTitleInput").focus();
		}, 100);
	},

	'blur #listTitleInput, keyup #listTitleInput'(e){
		if(e.type === "keyup" && e.which !== 13) return false;
		let title = e.currentTarget.value;
		let listId = FlowRouter.getParam("listId");
		const instance = Template.instance();

		Meteor.call('Lists.updateTitle', listId, title);
		instance.state.set('editingTitle', false);
	},

	'click #namesTable th.sortable span'(e){
		let data = $(e.currentTarget).data('sort');
		let sort = Session.get('sortNames');

		if(sort.term === data){
			sort.descending = !sort.descending;
			Session.set('sortNames', sort);
		} else {
			sort = {term: data, descending: true};
			Session.set('sortNames', sort);
		}
	},

	'change #showArrivedGuests'(e){
		const instance = Template.instance();
		let state = Session.get('showArrivedGuests');
		Session.set('showArrivedGuests', !state);
	}
});
