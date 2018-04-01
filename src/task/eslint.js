var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var child_process = require('child_process');
var libEslint = require('arms-lib-eslint');

var inquirer = require('inquirer');
var home = require('user-home');
var chalk = require('chalk');

var proPath = process.cwd();
var iAnswers = {};

var ora = require('ora');
var spinnerInit = ora('now is init our eslint config ...');



var fs = require('fs');
var task = {
	'checkdir': function(cb){
		fs.exists(path.resolve(proPath, './'+iAnswers.pathName+'/'), function (exists){
			cb && cb(exists);
		});
	},
	'createdir': function(cb){
		var self = this;
		loadNormalTmpl(function(){
			console.log('\ninit project ok and please read README.md !');
			console.log('\nPlease input : '+chalk.green('$ cd '+iAnswers.pathName+' && npm install '));
			// self.creatDist();
			cb && cb();
		});
	},
	creatDist: function(){
		var self = this;
		fs.mkdir(path.resolve(proPath, './dist/'), function(){
			spinnerInit.stop();
			console.log('dir creat success!');
			console.log('next install lib ...');
			self.installLib();
		});
	},
	installLib: function(){
		child_process.execSync('cd ' + proPath + ' && ' + 'cnpm install', function(){
			console.log('install ok');
		});
	}
};



exports.render = function(){
	inquirer.prompt([{
	//     type: 'list',
	//     message: 'a new config or cover an old config',
	//     name: 'type',
	//     choices: ['new', 'cover']
	// },{
	    type: 'list',
	    message: 'which env do you want:',
	    name: 'env',
	    choices: ['browser', 'node']
	},{
	    type: 'checkbox',
	    message: 'which rules do you want:',
	    name: 'rulesList',
	    choices: libEslint.getRuleNames().map((ruleName) => {return {'name': ruleName}})
	}]).then(function (answers) {
		
		iAnswers = answers;
	  	if (answers.rulesList != '') {
	  		spinnerInit.start();
			// console.log(answers.rulesList);
			var option = {
				env: {},
				rulesList: answers.rulesList
			};
			option.env[answers.env] = true;
			var eslintConfig = libEslint.getConfig(option);
			var distPath = path.join(proPath, '.eslintrc.json');
			fs.writeFileSync(distPath, JSON.stringify(eslintConfig, null, 4), 'utf8');
			spinnerInit.stop();
			console.log('please check you current path for file ".eslintrc.json" ')
	    }else{
	    	console.log('please at least one rule');
	    	return;
	    }

	 //    spinnerInit.start();
		// task.checkdir(function(exists){
		// 	if(exists){
		// 		console.log("\nthis project had init! please use other name.");
		// 		spinnerInit.stop();

		// 	}else{
		// 		task.createdir(function(){
		// 			// if(answers.tpllanguage == 'velocity'){
		// 			// 	velocityChange();
		// 			// }
		// 			spinnerInit.stop();
		// 		});
		// 		// task.creatDist();
				
		// 	}
		// })
	})	
};