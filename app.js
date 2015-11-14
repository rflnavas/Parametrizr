'use strict';
var objData = {
		id : 5,
		role : 'A',
		geo : { lat : 23.4104, lan : 56.4958 },
		stats : [6, 2, 7, 9, 10, 5]
	};
var scores = {scores : [86, 40, 61]};
var pr = new Parametrizr()
	.add('query', 'looking for something')
	.add('time', new Date().toString());

var req1 = Parametrizr.ParamsToString(objData);

var req2 = Parametrizr.join(pr.get(), objData, scores);



console.log('req1 ->' + req1);

console.log('req2 -> ' + req2);

console.log('Removing parameter : '  + Parametrizr.removeParameter(req2, 'role'));

pr.clear();
console.log('##' + Parametrizr.join(pr.get(), objData, scores));



var requestStr = Parametrizr.ParamsToString({
	id : {'INF_ACT_2' : 'INF_TIT'},
	params : {
		'tipo' : 'P',
		'accion' : 6
	},
	campos : ['X_TAL', 'X_ROL']
});

console.log(requestStr);

console.log(Parametrizr.join(req2, requestStr));

var pu = new Parametrizr()
	.add('x', 1)
	.add('y', 2);

//pu.setRequired('x').setRequired(['w','v']);

//Parametrizr.configuration.required = ['id'];

//console.log(pu.toString());
var pu2 = new Parametrizr()
	.add('z', -3)
	.add('t', 5);

console.log('Before joining pu =' + pu);

console.log('Before joining pu2 = ' + pu2);

pu.join(pu2);

console.log('After joining ->' + pu.join(pu2));

pu.invoke(
	function(msg){
		console.log('Function invoked!' + msg)
	}, ['Some Data...']);


/*
var reqOk = "am=3&place=NY";
var reqFail = "akfgvn";
var reqFail2 = "akfg&vn";
var reqFail3 = "a=kfg&vn&name=FRY&";//(&(\w+)=(\w*))*
var paramRegExp = /(\w+)=(\w*)/;
if(paramRegExp.test(reqOk)){
	console.log("YES");
}

*/