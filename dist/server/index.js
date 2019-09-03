#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const dev_1 = require("./dev");
const start_1 = require("./start");
const restart_1 = require("./restart");
const stop_1 = require("./stop");
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
    .action(dev_1.default);
program.command('start')
    .description('run server with pm2, env = production')
    .option('-b, --base <base>', 'project base dir<like package.json dirname>', '.')
    .option('-m, --max <max>', 'how many process would you like to bootstrap', 0)
    .option('-c, --config <config>', 'where is the config file which named nelts.config.<ts|js>', 'dist/nelts.config')
    .option('-p, --port <port>', 'which port do server run at?', 8080)
    .option('-d, --module <module>', 'which module install?', '@nelts/nelts')
    .option('-e, --env <env>', 'run at any env', 'production')
    .action(start_1.default);
program.command('restart')
    .description('restart the production server')
    .action(restart_1.default);
program.command('stop')
    .description('stop the production server')
    .action(stop_1.default);
program.parse(process.argv);
