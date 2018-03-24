
var path = require("path"); 
var static = require('node-static');
var http = require('http');
var ora = require('ora');
var inquirer = require('inquirer');


var ROOT_PATH = path.resolve(__dirname);
var proPath = process.cwd();

var spinnerStart = ora('Server is start ...');

var server = function(port){
	console.log('Server is ready at ', port);
	var file = new static.Server(proPath);
	http.createServer(function (request, response) {
		spinnerStart.start();
		request.addListener('end', function(){
			file.serve(request, response);
			console.log('request end');
		}).resume();
	}).listen(port);
}


var task = {
	'render': function(){
		inquirer.prompt([{
		    type: 'input',
		    message: 'which port do you want listen:',
		    name: 'port',
		    default: function () {
		      return '3000';
		    }
		}]).then(function (answers) {
			server(answers.port);
		})	
	}
}

exports.render = function(){
	task.render();
};
