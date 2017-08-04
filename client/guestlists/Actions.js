import { Template } from 'meteor/templating';

import './GuestLists.html';

Template.guestlist_actions.rendered = function(){
	this.dropdown = new Foundation.DropdownMenu($('.dropdown.menu'), {
		clickOpen: true
	});
};

Template.guestlist_actions.events({
	'click .dropdown.menu .menu'(e, instance){
		instance.dropdown._hide();
	},
	'click .share'(e, instance){
		Template.Modal.show('Sharing', this._id);
	}
});

Template.guestlist_actions.helpers({
	/**
	 * Returns whether user is authorized
	 * @param  {Int} role The minumum role level
	 * @return {Boolean}      True if user is at least the provided minumum role level
	 */
	userRole: function(role){
		var userRole = this.creator === Meteor.userId() ? 0 : _.find(this.users, function(user){
			return user._id == Meteor.userId() 
		}).role;
		return userRole <= role;
	}
});