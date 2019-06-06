const emitter = require('events');
const { CHILD_PROCESS_TYPE } = require('./utils');
module.exports = class Node extends emitter {
  constructor(target, kind, name) {
    super();
    this._target = target;
    this._status = 0;
    this._kind = kind;
    this._name = name;
  }

  get pid() {
    switch (this._kind) {
      case CHILD_PROCESS_TYPE.WORKER: return this._target.process.pid;
      case CHILD_PROCESS_TYPE.AGENT: return this._target.pid;
    }
  }

  get killed() {
    switch (this._kind) {
      case CHILD_PROCESS_TYPE.WORKER: return this._target.isDead();
      case CHILD_PROCESS_TYPE.AGENT: return this._target.killed;
    }
  }

  set status(value) {
    this._status = value;
    this.emit('status', value);
  }

  get status() {
    return this._status;
  }

  onClose(app) {
    this._target.on('exit', code => {
      this.status = code ? 4 : 5;
      switch (this._kind) {
        case CHILD_PROCESS_TYPE.WORKER: 
          const index = app._workers.indexOf(this);
          if (index > -1) {
            app._workers.splice(index, 1);
            delete app._pids[this.pid];
          }
          break;
        case CHILD_PROCESS_TYPE.AGENT: 
          for (const i in app._agents) {
            if (app._agents[i] === this) {
              delete app._agents[i];
              delete app._pids[this.pid];
            }
          }
          break;
      }
    });
  }
  
  onCreatedReceiveMessage(callback) {
    this._target.on('message', (message, socket) => callback(message, socket));
  }

  close() {
    this.status = 3;
    this._target.send('kill');
    this._target.kill('SIGTERM');
  }
}