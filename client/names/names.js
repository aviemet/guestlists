import Lists from '../../collections/Lists.js';
import { buildNameObject } from '../../lib/utils';

import './Names.html';

Template.Names.onCreated(function(){
	this.state = new ReactiveDict();
	this.state.set('editingTitle', false);
	Meteor.subscribe('allLists');
	Session.set('sort', 'firstName');
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

		if(filter && filter != ""){
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

		// return list.names;
		return _.sortBy(list.names, Session.get('sort'));
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
		if(confirm('Are you sure?\nThis will delete all names on this list')){
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
	}
});

Template.addNamesForm.onCreated(function(){
	this.state = new ReactiveDict();
	this.state.set('inputType', 'filterNames');
	Session.set('filterQuery', "");
});

Template.addNamesForm.helpers({
	inputType(type){
		const instance = Template.instance();
		return type === instance.state.get('inputType');
	}
});

Template.addNamesForm.events({
	/////////////////
	// Form Events //
	/////////////////
	'submit #addNamesForm'(e){
		e.preventDefault();
		
		if(e.target.name){
			let name = e.target.name.value.trim();
			let listId = FlowRouter.getParam("listId");

			if(name !== ""){
				Meteor.call('Lists.addName', listId, name);
			}

			e.target.name.value = "";
		}
	},

	'paste #namesInput'(e){
		$("#pasteableInput").focus();
		setTimeout(function(){
			handlePastedNames($("#pasteableInput").val());
			$("#pasteableInput").val("");
			$("#namesInput").focus();
		}, 0);
	},

	'change #inputSelect'(e){
		const instance = Template.instance();
		
		instance.state.set('inputType', e.currentTarget.value);
	},

	'keyup #filterInput'(e){
		let val = e.currentTarget.value;

		Session.set('filterQuery', val);
	},

	'click #clearFilter'(e){
		$("#filterInput").val('');
		Session.set('filterQuery', '');
	}
});

function handlePastedNames(input){
	var namesArray = [];

	let listId = FlowRouter.getParam("listId");
	let lines = input.split('\n');
	$.each(lines, function(i, line){
		let name = buildNameObject(line);
		if(name){
			namesArray.push(name);			
		}
	});
	Meteor.call('Lists.bulkAddNames', listId, namesArray);
}