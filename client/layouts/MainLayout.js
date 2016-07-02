import { Template } from 'meteor/templating';

import './MainLayout.html';

Template.MainLayout.onCreated(function(){
	Session.set('callout', false);
});

Template.MainLayout.helpers({
	callout(){
		return Session.get('callout');
	}
});
