
Template.Modal.rendered = function(){
	this.elem = new Foundation.Reveal($("#modal"), {});
	console.log('modal rendered');
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