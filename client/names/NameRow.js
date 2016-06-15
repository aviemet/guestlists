import Lists from '../../collections/Lists.js';

import './NameRow.html';

Template.NameRow.onCreated = function(){
	Meteor.subscribe('allLists');
};

Template.NameRow.helpers({
	checkArrived(){
		var check = this.arrived;
		return check ? "checked" : "";
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
		
		if(arrived){
			$(e.currentTarget).closest('tr').fadeOut(function(){			
				Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived);
			});
		} else {
			Meteor.call('Lists.toggleNameArrived', listId, nameId, arrived)
		}
	},
	
	'click td.name'(e){
		// Arrived guests have a line through the, editing would look bad (also why edit an arrived guest?)
		if(!$(e.currentTarget).closest('tr').hasClass('arrived')){
			var $input = $(e.currentTarget).find('input.editable').attr('disabled', false);
			setTimeout(function(){
				$input.focus();
			}, 10);
			$input.on('blur keyup', function(e){
				if(e.type === "keyup" && e.which !== 13) return false;
				
				let listId = FlowRouter.getParam("listId");
				let nameId = $(e.currentTarget).closest('tr').data('id');
				let name = {};
				name[$input.attr('name')] = $input.val();
				Meteor.call('Lists.updateName', listId, nameId, name);
				
				$(this).attr('disabled', true);
				if(_.isFunction(this.off)){
					this.off('blur keyup');
				}
			});
		}
	},
	
	'change td.ticker input'(e){
		let listId = FlowRouter.getParam("listId");
		let nameId = $(e.currentTarget).closest('tr').data('id');
		Meteor.call('Lists.updateArrivedGuests', listId, nameId, parseInt(e.currentTarget.value));
	}
});


