import { Template } from 'meteor/templating';

import './Modal.html';

Template.Modal.onCreated(function(){
	Session.set('activeModal', false);
});

Template.Modal.rendered = function(){
	Template.Modal.modal = new Foundation.Reveal($("#modal"));

	Template.Modal.show = function(template, data = null){
    	Session.set('activeModal', {template: template, data: data});
		Template.Modal.modal.open();

		$(document).one('closed.zf.reveal', function(){
			Session.set('activeModal', false);
		});
	};
};

Template.Modal.helpers({
	activeModal: function() {
		return Session.get('activeModal').template;
	}
});

Template.Modal.events({
	'click button.close-button'(e){
		Session.set('callout', false);
	}
});

// http://meteorcapture.com/simple-modal-pattern/
