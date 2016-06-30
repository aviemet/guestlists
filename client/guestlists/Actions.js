import { Template } from 'meteor/templating';

import './GuestLists.html';

Template.guestlist_actions.rendered = function(){
	this.elem = new Foundation.DropdownMenu($('.dropdown.menu'), {
		clickOpen: true
	});
};

Template.guestlist_actions.events({
	'click .dropdown.menu .menu'(e){
		const instance = Template.instance();
		instance.elem._hide();
	}
});