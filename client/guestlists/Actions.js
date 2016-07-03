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
		window['modal'] = Template.Modal;
    	Session.set('activeModal', 'Groups');
    	Template.Modal.show();
	}
});
