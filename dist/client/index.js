#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const init_1 = require("./init");
const pkg = require('../../package.json');
program.version(pkg.version, '-v, --version');
program.command('init [project]')
    .description('create a new project with nelts.')
    .action(init_1.default);
program.parse(process.argv);
