var path = require('path');
var ROOT_PATH = path.resolve(__dirname);
var child_process = require('child_process');
var download = require('../down-code.js');
var inquirer = require('inquirer');
var home = require('user-home');
var chalk = require('chalk');

var proPath = process.cwd();
var iAnswers = {};

var ora = require('ora');
var spinnerInit = ora('now is init our porject ...');
//
var tmplUrlMap= {
	'webpack2': 'github:grARM/arms-tmpl-webpack2#master',
	'jslib': 'github:grARM/arms-tmpl-jslib#master',
	'vue2': 'github:grARM/arms-tmpl-vue2#master'
	// 'module': 'gitcodeoa:translator/arms-tmpl-module#master'
};

var tmplUrl = tmplUrlMap['webpack2'];


/** get code from github */
var loadNormalTmpl = function(cb){
	// console.log('\nhome: ', home, 'proPath: ', proPath);
	download(tmplUrl, iAnswers.pathName, {clone: true}, function (err) {
		if(err){
			console.log('err', err);
		}
		cb && cb(err);
	});
}



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
	    type: 'list',
	    message: 'which template do you need:',
	    name: 'template',
	    choices: ['webpack2', 'jslib', 'vue2']
	},{
	    type: 'input',
	    message: 'which pathName do you want:',
	    name: 'pathName',
	    default: function () {
	      return 'armsPath';
	    }
	}]).then(function (answers) {
		iAnswers = answers;
	  	if (answers.template!= '') {
			tmplUrl = tmplUrlMap[answers.template] || tmplUrlMap['webpack2'];
	    }else{
	    	console.log('目前只发布了 3 模板');
	    	return;
	    }

	    spinnerInit.start();
		task.checkdir(function(exists){
			if(exists){
				console.log("\nthis project had init! please use other name.");
				spinnerInit.stop();

			}else{
				task.createdir(function(){
					// if(answers.tpllanguage == 'velocity'){
					// 	velocityChange();
					// }
					spinnerInit.stop();
				});
				// task.creatDist();
				
			}
		})
	})	
};