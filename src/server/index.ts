#!/usr/bin/env node

import * as program from 'commander';
import Dev from './dev';
import Start from './start';
import ReStart from './restart';
import Stop from './stop';

const pkg = require('../../package.json');
program.version(pkg.version, '-v, --version');

program.command('dev')
  .option('-b, --base <base>', 'project base dir<like package.json dirname>', '.')
  .option('-m, --max <max>', 'how many process would you like to bootstrap', 0)
  .option('-c, --config <config>', 'where is the config file which named nelts.config.<ts|js>', 'nelts.config')
  .option('-p, --port <port>', 'which port do server run at?', 8080)
  .action(Dev);

program.command('start')
  .option('-b, --base <base>', 'project base dir<like package.json dirname>', '.')
  .option('-m, --max <max>', 'how many process would you like to bootstrap', 0)
  .option('-c, --config <config>', 'where is the config file which named nelts.config.<ts|js>', 'nelts.config')
  .option('-p, --port <port>', 'which port do server run at?', 8080)
  .action(Start);

program.command('restart').action(ReStart);
program.command('stop').action(Stop);


program.parse(process.argv);