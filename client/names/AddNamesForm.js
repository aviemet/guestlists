import Lists from '../../collections/Lists.js';
import { buildNameObject } from '../../lib/utils';

Template.addNamesForm.onCreated(function(){
	this.state = new ReactiveDict();
	this.subscription = Meteor.subscribe('lists');
	Session.set('filterQuery', "");
});

/**
 * Waiting for the subscription to be ready
 * This is a "not the meteor way" hack to wait until the subscription to Lists
 * is ready in the rendered function so that I can update the selected attribute
 * of the option input box. Only necessary because I can't conditionally set an
 * attribute, only an attribute's values. The "correct" way to do this would be
 * in the template with a conditional arround the selected attribute listening
 * to the size of the names array in the list. If I were able to do this, the
 * waitForSubscription method and the rendered method would be unnecessary.
 */
function waitForSubscription(subscription, cb){
	setTimeout(function(){
		if(subscription.ready()){
			cb();
		} else {
			waitForSubscription(subscription, cb);
		}
	}, 10);
}

Template.addNamesForm.rendered = function(){
	const instance = Template.instance();
	const listId = FlowRouter.getParam("listId");

	waitForSubscription(instance.subscription, function(){
		let count = Lists.findOne({_id: listId}).names.length;
		instance.state.set('inputType', count === 0 ? 'addNames' : 'filterNames');

		let selectId = instance.state.get('inputType');
		$("#"+selectId).attr('selected', 'selected');
	});

};

Template.addNamesForm.helpers({
	inputType(type){
		const instance = Template.instance();
		return type === instance.state.get('inputType');
	}
});

Template.addNamesForm.events({
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
			var count = insertPastedNames($("#pasteableInput").val());
			$("#pasteableInput").val("");
			$("#namesInput").focus();
			Session.set('callout', {title: count + ' names added', center: true});
		}, 10);
	},

	'change #inputSelect'(e){
		const instance = Template.instance();
		instance.state.set('inputType', e.currentTarget.value);
		Session.set('filterQuery', "");
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

function insertPastedNames(input){
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
	return lines.length;
}
