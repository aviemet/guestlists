import './MainMenu.html';

Template.MainMenu.rendered = function(){
	this.$menu = new Foundation.DropdownMenu($("#navbar .menu"), {
		clickOpen: true
	});
};