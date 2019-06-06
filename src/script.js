const path = require('path');
const isClass = require('is-class');
const babelRegister = require('@babel/register');
const processer = require('./index');
const { STATUS, CHILD_PROCESS_TYPE } = require('./utils');
const commandArgvParser = require('minimist');
require('reflect-metadata');

let args = {};
const argv = process.argv.slice(2);

if (!argv.length) {
  console.error('process.argv need arguments');
  process.exit(1);
}

if (argv.length === 1 && argv[0].startsWith('{') && argv[0].endsWith('}')) {
  args = JSON.parse(argv[0]);
} else {
  args = commandArgvParser(argv) || {};
}

if (!path.isAbsolute(args.script)) {
  args.script = path.resolve(process.cwd(), args.script);
}

args.kind = args.kind || CHILD_PROCESS_TYPE.MASTER;
args.mpid = args.mpid || process.pid;

babelRegister({
  cache: (args.env || process.env.NODE_ENV) === 'production',
  only: [ /\/package\// ],
  extensions: ['.js', '.mjs'],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
});

const errorHandler = err => {
  console.error('[bootstrap error]:', err);
  sendToParent(STATUS.BOOTSTRAP_FAILED);
  process.exit(1);
}

bindError(errorHandler);

const sandbox = require(args.script);
if (!isClass(sandbox)) {
  throw new Error('script must be a class: ' + args.script);
}

class Runtime {
  constructor() {
    this.processer = new processer(args.kind, args.mpid);
    this.processer.onExit(next => this.destroy().then(next).catch(next));
    this.sandbox = new sandbox(args);
    this.sandbox.kill = this.processer.kill.bind(this.processer);
    this.sandbox.createAgent = (name, file, _args) => this.processer.createAgent(args.cwd || process.cwd(), name, file, _args);
    this.sandbox.createWorkerForker = (file, _args) => this.processer.createWorkerForker(args.cwd || process.cwd(), 'worker', file, _args);
  }

  async create() {
    if (typeof this.sandbox.componentWillCreate) await this.sandbox.componentWillCreate();
    this.createMessager();
    unbindError(errorHandler);
    this.errorHandler = err => this.sandbox.componentCatchError && this.sandbox.componentCatchError(err);
    bindError(this.errorHandler);
    if (typeof this.sandbox.componentDidCreated === 'function') await this.sandbox.componentDidCreated();
  }

  async destroy() {
    if (typeof this.sandbox.componentWillDestroy) await this.sandbox.componentWillDestroy();
    process.off('message', this.messageHandler);
    delete this.sandbox.send;
    delete this.sandbox.kill;
    delete this.sandbox.createAgent
    unbindError(this.errorHandler);
    const errorHandler = err => console.error('[closing error]:', err);
    bindError(errorHandler);
    if (typeof this.sandbox.componentDidDestroyed) await this.sandbox.componentDidDestroyed();
  }

  async createMessager() {
    this.messageHandler = (message, socket) => {
      switch (message) {
        case 'kill': this.processer._closingSelfStatus = 1; break;
        default: this.sandbox.componentReceiveMessage && this.sandbox.componentReceiveMessage(message, socket);
      }
    };
    this.sandbox.send = (message, socket) => {
      const options = {
        message,
        from: process.pid
      }
      sendToParent(options, socket);
    }
    process.on('message', this.messageHandler);
  }
}

new Runtime()
  .create()
  .then(() => sendToParent(STATUS.BOOTSTRAP_SUCCESS));

function bindError(callback) {
  ['error', 'unhandledRejection', 'uncaughtException'].forEach(name => process.on(name, callback));
}

function unbindError(callback) {
  ['error', 'unhandledRejection', 'uncaughtException'].forEach(name => process.off(name, callback));
}

function sendToParent(value) {
  if (args.kind !== CHILD_PROCESS_TYPE.MASTER) {
    process.send(value);
  }
}
