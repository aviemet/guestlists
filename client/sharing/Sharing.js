import Lists from '../../collections/Lists';
import {Roles} from '../../lib/utils';

import './Sharing';

Template.Sharing.onCreated(function(){
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

		const list = Lists.findOne({_id: Session.get('activeModal').data});
		return list && list.hasOwnProperty('users') ? list.users : [];
	},
	roles: function(id){
		if(!Number.isInteger(id)) return Roles;
		return Roles[id];
	},
	selected: function(index, user_role){
		return index === user_role ? 'selected' : '';
	},
	callout: function(){
		return true;
	}
});

Template.Sharing.events = ({
	'keyup input'(e){ // Resize modal for more content
	},
	'autocompleteselect input'(e, template, user) {
		$('#individual_share_hidden').val(user._id);
	},
	'click #individual_share_button'(e){
		const userId = $('#individual_share_hidden').val();
		const listId = Session.get('activeModal').data;
		if(!shareList(listId, userId)){
			
		}
	},
	'click .unshare'(e){
		const userId = $(e.currentTarget).data('id');
		const listId = Session.get('activeModal').data;
		Meteor.call('User.unshareList', userId, listId);
	},
	'change select.roles_select'(e){
		const userId = $(e.currentTarget).data('id');
		const listId = Session.get('activeModal').data;
		const role = $(e.currentTarget).val();
		Meteor.call('User.updateListRole', userId, listId, parseInt(role));
	}
});

shareList = (listId, userId) => {
	if(listId && userId){
		Meteor.call('User.shareList', userId, listId, 1); // Default user role is 'edit'
	} else {
		const input = $("#individual_share_input").val();
		const user = Meteor.users.findOne({"services.google.email": input});
		if(user){
			Meteor.call('User.shareList', user._id, listId, 1);
		} else {
			return false;
		}
	}
}
