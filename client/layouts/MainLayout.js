import { Template } from 'meteor/templating';

import './MainLayout.html';

Template.MainLayout.onCreated(function(){
	Session.set('callout', false);
	Session.set('modal', false);
});

Template.MainLayout.helpers({
	callout(){
		return Session.get('callout');
	},
	modal(){
		return Session.get('modal');
	}
});
