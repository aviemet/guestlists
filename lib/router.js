const publicRoutes = FlowRouter.group({ name: 'public' });
const privateRoutes = FlowRouter.group({ name: 'private' });

///////////////////
// Public Routes //
///////////////////
publicRoutes.route('/', {
	name: "home",
	action(){
		Session.set('document-title', 'Guest Lists');
		if(!Meteor.userId()){
			BlazeLayout.render('MainLayout', {content: 'login'});
		} else {
			FlowRouter.go('lists');
		}
	}
});

////////////////////
// Private Routes //
////////////////////
privateRoutes.route('/lists', {
	name: "lists",
	action(){
		Session.set('document-title', 'Guest Lists | Lists');
		BlazeLayout.render('MainLayout', {content: 'GuestLists'});
	}
});

privateRoutes.route('/lists/:listId', {
	name: "names",
	action(params, queryParams) {
		BlazeLayout.render('MainLayout', {content: 'Names'});
	}
});

privateRoutes.route('/groups', {
	name: "groups",
	action(){
		Session.set('document-title', 'Guest Lists | Group Policies');
		BlazeLayout.render('MainLayout', {content: 'Groups'});		
	}
});

// privateRoutes.route('/groups/manage/:groupId', {
// 	name: "group",
// 	action(){
// 		BlazeLayout.render('MainLayout', {content: 'Group'});		
// 	}
// });

//////////////////
// Auth control //
//////////////////
if(Meteor.isClient){
	Accounts.onLogin(function(){
		FlowRouter.go('lists');
	});

	Accounts.onLogout(function(){
		FlowRouter.go('home');
	});
}

FlowRouter.triggers.enter([function(context, redirect){
	if(!Meteor.userId()){
		FlowRouter.go('home');
	}
}])