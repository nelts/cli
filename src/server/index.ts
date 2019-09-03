#!/usr/bin/env node

import * as program from 'commander';
import Dev from './dev';
import Start from './start';
import ReStart from './restart';
import Stop from './stop';

const pkg = require('../../package.json');
program.version(pkg.version, '-v, --version');

program.command('dev')
  .description('run server as dev mode, env = development')
  .option('-b, --base <base>', 'project base dir<like package.json dirname>', '.')
  .option('-m, --max <max>', 'how many process would you like to bootstrap', 0)
  .option('-c, --config <config>', 'where is the config file which named nelts.config.<ts|js>', 'src/nelts.config')
  .option('-p, --port <port>', 'which port do server run at?', 8080)
  .option('-d, --module <module>', 'which module install?', '@nelts/nelts')
  .option('-e, --env <env>', 'run at any env', 'production')
  .action(Dev);

program.command('start')
  .description('run server with pm2, env = production')
  .option('-b, --base <base>', 'project base dir<like package.json dirname>', '.')
  .option('-m, --max <max>', 'how many process would you like to bootstrap', 0)
  .option('-c, --config <config>', 'where is the config file which named nelts.config.<ts|js>', 'dist/nelts.config')
  .option('-p, --port <port>', 'which port do server run at?', 8080)
  .option('-d, --module <module>', 'which module install?', '@nelts/nelts')
  .option('-e, --env <env>', 'run at any env', 'production')
  .action(Start);

program.command('restart')
  .description('restart the production server')
  .action(ReStart);

program.command('stop')
  .description('stop the production server')
  .action(Stop);


program.parse(process.argv);