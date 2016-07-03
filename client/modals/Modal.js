import { Template } from 'meteor/templating';

import './Modal.html';

Template.Modal.rendered = function(){
	Template.Modal.modal = new Foundation.Reveal($("#modal"), {});

	Template.Modal.show = function(){
		Template.Modal.modal.open();
	};
};

Template.Modal.events({
	'click button.close-button'(e){
		Session.set('callout', false);
	}
});

Template.Modal.helpers({
  activeModal: function() {
    return Session.get('activeModal');
  }
});

// http://meteorcapture.com/simple-modal-pattern/
