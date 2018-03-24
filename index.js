#!/usr/bin/env node

console.log('welcome to arms');
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author  @grARM
*/
// var path = require('path');
// var _ = require('underscore');
var program = require('commander');
var chalk = require('chalk');


program
    .version(require('./package').version)
    .option('-i, --init', 'init project')
    .option('-s, --server', 'start a local server')
    .parse(process.argv);



/** init */
if (program.init) {
	require('./src/task/init.js').render();
} else if(program.server) {
  require('./src/task/local-server.js').render();
}

program.on('--help', function () {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project by an official template'))
  console.log('    $ webbuilder --init')
  console.log()
  console.log('    If you have any questions, please contact me（grARM）,')
  console.log('    send email to gricode@126.com')
  console.log()
})

/**
 * Help.
 */

// function help () {
//   program.parse(process.argv)
//   if (program.args.length < 1) return program.help()
// }
// help()


/** start server */
// if (program.server) {
// 	require('./src/tasks/task-server.js').render();
// }
