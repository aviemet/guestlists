export const UUID = function(){
	var d = new Date().getTime();
	if(Meteor.isClient && window.performance && typeof window.performance.now === "function"){
		d += performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxyyyyxy'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
}

export const buildNameObject = function(name){
		let nameObj = {
			id: UUID(),
			createdAt: new Date(),
			arrived: false,
			plus: 0
		}
		
		let plus = name.match(/(\d)/);
		if(plus){
			nameObj.plus = plus[0];
		}
		
		let matches = name.match(/([a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?),\s*([a-zA-Z'\.\-]+)(?:\s+([a-zA-Z'\.\-](?=\.)|[a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?))?|([a-zA-Z'\.\-]+)\s+(?:([a-zA-Z'\.\-](?=\.)|[a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?)\s+)?([a-zA-Z'\.\-]+(?:-[a-zA-Z'\.\-]+)?)/);
		nameObj.firstName = matches[2] || matches[4];
		nameObj.lastName = matches[1] || matches[6];
		nameObj.firstName = nameObj.firstName.capitalize();
		nameObj.lastName = nameObj.lastName.capitalize();

		return nameObj;
}

String.prototype.capitalize = function(lower) {
	return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};