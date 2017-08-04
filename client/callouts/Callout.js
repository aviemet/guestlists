import './Callout.html';

Template.Callout.rendered = function(){
	setTimeout(function(){
		$('.callout').fadeOut('slow', function(){
			Session.set('callout', false);
		});
	}, 1000);
};

Template.Callout.events({
	'click button.close-button'(e){
		Session.set('callout', false);
	}
});
