#!/usr/bin/env node

'use strict';
var examplejs = require('./');
var optimist = require('optimist');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var util = require('util');
var glob = require('glob');

var argv = optimist
  .usage('$0 glob1 [glob2] -o output [a]')
  .alias('d', 'desc')
  .describe('desc', 'describe text.')
  .string('d')

  .alias('t', 'timeout')
  .describe('t', 'timeout.')
  .string('t')

  .alias('o', 'output')
  .describe('o', 'output file.')
  .string('o')

  .alias('g', 'globals')
  .describe('g', 'global exports.')
  .string('g')

  .alias('h', 'head')
  .describe('h', 'head file.')
  .string('h')

  .alias('v', 'version')
  .describe('v', 'Print version number and exit.')
  .wrap(80)
  .argv;

if (argv.version) {
  var json = require('./package.json');
  console.log(json.name + ' ' + json.version);
  return;
}

if (argv._.length < 1) {
  console.error('The input file is not specified.');
  return;
}

var filenames = [];
var header;
if (argv.head) {
  header = String(fs.readFileSync(argv.head));
}

argv._.forEach(function (filename) {
  new glob(filename, {
    sync: true
  }).forEach(function (item) {
    if (filenames.indexOf(item) < 0) {
      filenames.push(item);
    }
  });
});

var contents = [];
if (header) {
  contents.push(header);
}
filenames.forEach(function (filename) {
  contents.push(examplejs.build(fs.readFileSync(filename), {
    desc: argv.desc || filename,
    timeout: argv.timeout,
    globals: argv.globals,
  }));
});

var content = contents.join('\n');
if (argv.output) {
  mkdirp(path.dirname(argv.output));
  fs.writeFileSync(argv.output, content);
  console.log(util.format('%j examplejs output complete.', filenames));
} else {
  console.log(content);
}