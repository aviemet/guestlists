import Lists from '../../collections/Lists.js';

import './Names.html';

Template.Names.onCreated(function(){
	Meteor.subscribe('allLists');
});
 
Template.Names.helpers({
	list(){
		let listId = FlowRouter.getParam("listId");
		var list = Lists.findOne({_id: listId});
		return list;
	}
});

Template.Names.events({
	'click button.success'(e){
		console.log(e.currentTarget.value);
	},

	'click button.alert'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = e.currentTarget.value;
		console.log('deleting '+nameId);
		Meteor.call('Lists.removeName', listId, nameId);
	},
	
	'change input.arrivedChecker'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = e.currentTarget.value;
		let arrived = e.currentTarget.checked;
		
		Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived);
	}
});

Template.addNamesForm.events({
	'submit #addNamesForm'(e){
		e.preventDefault();
		
		let target = e.target;
		let name = target.name.value;
		let listId = FlowRouter.getParam("listId");

		Meteor.call('Lists.addName', listId, name);

		target.name.value = "";
	}
});