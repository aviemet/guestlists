import './MainMenu.html';

Template.MainMenu.rendered = function(){
	this.$menu = new Foundation.DropdownMenu($("#menu"), {
		clickOpen: true
	});
	window.menu = this.$menu;
};