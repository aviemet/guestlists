const publicRoutes = FlowRouter.group({ name: 'public' });
const privateRoutes = FlowRouter.group({ name: 'private' });

///////////////////
// Public Routes //
///////////////////
publicRoutes.route('/', {
	name: "home",
	action(){
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
		BlazeLayout.render('MainLayout', {content: 'GuestLists'});
	}
});

privateRoutes.route('/lists/:listId', {
	name: "names",
	action(params, queryParams) {
		// console.log({params: params, queryParams: queryParams});
		BlazeLayout.render('MainLayout', {content: 'Names'});
	}
});


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