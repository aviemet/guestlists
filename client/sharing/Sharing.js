import Lists from '../../collections/Lists';

import './Sharing';

Template.Sharing.onCreated(function(){
	Meteor.subscribe('groups');
	Meteor.subscribe('users');
	Meteor.subscribe('lists');
});

Template.Sharing.helpers({
	settings: function() {
		return {
			position: "bottom",
			// limit: 5,
			rules: [
				{
					collection: Meteor.users,
					field: 'services.google.email',
					selector: function(match){
						regex = new RegExp(match, 'i');
						return {$or: [{'services.google.email': regex}, {'services.google.name': regex}]};
					},
					// filter: Meteor.userId(),
					template: Template.EmailAutocomplete
				}
			]
		};
	},
	data: function(){
		return Session.get('activeModal').data;
	},
	sharedUsers: function(){
		if(!Session.get('activeModal')) return false;

		var list = Lists.findOne({_id: Session.get('activeModal').data});
		return list && list.hasOwnProperty('users') ? list.users : [];
	}
});

Template.Sharing.events = ({
	'keyup input'(e){ // Resize modal for more content
		// console.log(Template.Modal.modal);
	},
	'autocompleteselect input'(e, template, user) {
		$('#individual_share_input').val(user._id);
	},
	'click #individual_share_button'(e){
		let userId = $('#individual_share_input').val();
		let listId = Session.get('activeModal').data;
		Meteor.call('User.shareList', userId, listId, 1);
	},
	'click .unshare'(e){
		let userId = $(e.currentTarget).data('id');
		let listId = Session.get('activeModal').data;
		Meteor.call('User.unshareList', userId, listId);
	}
})
