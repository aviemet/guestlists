import Lists from '../../collections/Lists.js';

import './NameRow.html';

Template.NameRow.onCreated = function(){
	Meteor.subscribe('lists');
};

Template.NameRow.rendered = function(){
	this.dropDown = new Foundation.DropdownMenu($(".dropdown"), {});
};

Template.NameRow.helpers({
	checkArrived(){
		var check = this.arrived;
		return check ? "checked" : "";
	},
	tickerClass(){ // using {{#with}} is scoped to the guests object
		if(this.expected < this.arrived){
			return "guests_over";
		}
	}
});

Template.NameRow.events({
	'click .delete'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = $(e.currentTarget).closest('tr').data('id');

		$(e.currentTarget).closest('tr').addClass('past').fadeOut('fast', function(){
			Meteor.call('Lists.removeName', listId, nameId);
		});
	},

	'change input.arrivedChecker'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = e.currentTarget.value;
		let arrived = e.currentTarget.checked;
		if(!Session.get('showArrivedGuests') && arrived){
			$(e.currentTarget).closest('tr').fadeOut(function(){
				Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived);
			});
		} else {
			Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived)
		}
	},

	'click td.name'(e){
		var _this = this;
		// Arrived guests have a line through the, editing would look bad
		// (also why edit an arrived guest?)
		if(!this.arrived){
			var $input = $(e.currentTarget).find('input.editable').attr('disabled', false);
			setTimeout(function(){
				$input.focus();
			}, 10);
			$input.on('blur keyup', function(e){
				if(e.type === "keyup" && e.which !== 13) return false;

				let listId = FlowRouter.getParam("listId");
				let name = {};
				name[$input.attr('name')] = $input.val();
				Meteor.call('Lists.updateName', listId, _this._id, name);

				$(this).attr('disabled', true);
				if(_.isFunction(this.off)){
					this.off('blur keyup');
				}
			});
		}
	},

	'click td.plus'(e){
		var _this = this;
		var $input = $(e.currentTarget).find('input.editable').attr('disabled', false);
		setTimeout(function(){
			$input.focus().select();
		}, 10);
		$input.on('blur keyup', function(e){
			if(e.type === "keyup" && e.which !== 13) return false;

			let listId = FlowRouter.getParam("listId");
			let count = parseInt($input.val());
			let nameId = $(e.currentTarget).closest('tr').data('id');
			Meteor.call('Lists.updateExpectedGuests', listId, nameId, count);

			$(this).attr('disabled', true);
			if(_.isFunction(this.off)){
				this.off('blur keyup');
			}
		});
	},

	'change td.ticker input'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = $(e.currentTarget).closest('tr').data('id');
		setTimeout(function(){
			Meteor.call('Lists.updateArrivedGuests', listId, nameId, parseInt(e.currentTarget.value));
		}, 10);
	}
});


