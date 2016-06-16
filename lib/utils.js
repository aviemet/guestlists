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

export const nameParamsFromString = function(name){
	name = name.trim();
	var nameObj = {
		firstName: "",
		lastName: "",
		plus: 0
	}; 

	let digitSplit = name.split(/[+]*?(\d+)$/);
	if(digitSplit.length > 1){
		nameObj.plus = digitSplit[1];
		name = digitSplit[0].trim();
	}

	var spaceCount = name.split(/\s+/).length - 1;
	var commaCount = name.split(',').length - 1;

	if(spaceCount > 0 || commaCount > 0){	
		let matches = name.match(/([a-zA-Z'.-]+(?:-[a-zA-Z'.-]+)?),\s*([a-zA-Z'.-]+)(?:\s+([a-zA-Z'.-](?=\.)|[a-zA-Z'.-]+(?:-[a-zA-Z'.-]+)?))?|([a-zA-Z'.-]+)\s+(?:([a-zA-Z'.-](?=\.)|[a-zA-Z'.-]+(?:-[a-zA-Z'.-]+)?)\s+)?([a-zA-Z'.-]+(?:-[a-zA-Z'.-]+)?)/);
		if(matches){
			nameObj.firstName = matches[2] || matches[4];
			nameObj.lastName = matches[1] || matches[6];
		} else {
			nameObj.firstName = name.replace(/[+,]/gi, "");
		}
	} else {
		nameObj.firstName = name;
	}

	nameObj.firstName = nameObj.firstName.capitalize();
	nameObj.lastName = nameObj.lastName.capitalize();
	return nameObj;
}

export const buildNameObject = function(name){
	if(name === "") return false;
	let names = nameParamsFromString(name);

	return {
		_id: UUID(),
		createdAt: new Date(),
		arrived: false,
		// Defaults:
		firstName: names.firstName,
		lastName: names.lastName,
		guests: {
			expected: names.plus,
			arrived: 0
		},
		notes: ""
	};
}
String.prototype.capitalize = function(lower){
	if(_.isEmpty(this) || this.match(/^\s+$/)){ return ""; }
	return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.tokenize = function(){
    return this.trim().toLowerCase().replace(/[^a-z0-9_\s]/g, '');
}

export const stringToTerms = function(str){
	let terms = str.tokenize().split(/\s+/g);

	var pattern = "";
	for(var i = 0; i < terms.length; i++){
		pattern += terms[i];
		if(i < terms.length - 1){
			pattern += "|";
		}
	}
	return pattern;
}