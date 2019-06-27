#!/usr/bin/env node
import * as program from 'commander';
import Init from './init';

const pkg = require('../../package.json');
program.version(pkg.version, '-v, --version');

program.command('init [project]')
  .description('create a new project with nelts.')
  .action(Init);

program.parse(process.argv);