import Lists from '../../collections/Lists.js';

import './Names.html';

Template.Names.onCreated(function(){
	this.state = new ReactiveDict();
	this.state.set('editingTitle', false);
	Meteor.subscribe('allLists');
	// Ensure Session variable purity
	if(!Session.get('sort') || !Session.get('sort').hasOwnProperty('term') || !Session.get('sort').hasOwnProperty('descending')){
		Session.set('sort', {term: 'firstName', descending: true});
	}
});
 
Template.Names.helpers({
	list(){
		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId});
		return list;
	},
	names(){
		let listId = FlowRouter.getParam("listId");
		var filter = Session.get('filterQuery');
		var list = Lists.findOne({_id: listId});

		if(filter != ""){
			// Build regex for search terms
			let terms = filter.trim().split(' ');

			var pattern = "";
			for(var i = 0; i < terms.length; i++){
				pattern += terms[i];
				if(i < terms.length - 1){
					pattern += "|";
				}
			}

			var regex = new RegExp(pattern, 'i');

			// Filter results by search terms
			list.names = _.filter(list.names, function(name){
				return regex.test(name.firstName) || regex.test(name.lastName);
			});
		}

		let names = _.sortBy(list.names, Session.get('sort').term);
		return Session.get('sort').descending ? names : names.reverse();
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
			});
		}
		return count;
	}
});

Template.Names.events({
	'click .edit'(e){
		// console.log(e.currentTarget.value);
	},

	'click .delete'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = $(e.currentTarget).closest('tr').data('id');

		Meteor.call('Lists.removeName', listId, nameId);
	},
	
	'change input.arrivedChecker'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = $(e.currentTarget).closest('tr').data('id');
		let arrived = e.currentTarget.checked;
		
		Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived);
	},

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

	'click #namesTable th.sortable'(e){
		let data = $(e.currentTarget).data('sort');
		let sort = Session.get('sort');

		if(sort.term === data){
			sort.descending = !sort.descending;
			Session.set('sort', sort);
		} else {
			sort = {term: data, descending: true};
			Session.set('sort', sort);
		}	
	}
});