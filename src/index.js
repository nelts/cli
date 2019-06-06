const path = require('path');
const Node = require('./node');
const cluster = require('cluster');
const { STATUS, safeClose, CHILD_PROCESS_TYPE } = require('./utils');
const childProcess = require('child_process');
const scriptFilename = path.resolve(__dirname, './script.js');

module.exports = class GateWay {
  constructor(kind = CHILD_PROCESS_TYPE.MASTER, master_pid) {
    this._masterPid = master_pid || process.pid;
    this._agents = {};
    this._workers = [];
    this._pids = {};
    this._kind = kind;
    this._onExit = null;
    this._closing = false;
    this._closingAgentsStatus = 0;
    this._closingWorkersStatus = 0;
    this._closingSelfStatus = kind === CHILD_PROCESS_TYPE.MASTER ? 1 : 0;
    this._timer = setInterval(() => {}, 7 * 24 * 60 * 1000);
    safeClose(() => this._close());
  }

  // 从子进程收到的消息
  // 需要我们转发
  _onMessage(message, socket) {
    if (typeof message === 'object') {
      const to = message.to;
      if (typeof to === 'number' && this._pids[to]) return this._pids[to].send(message, socket);
      if (typeof to === 'string' && this._agents[to]) return this._agents[to].send(message, socket);
      if (this._kind !== CHILD_PROCESS_TYPE.MASTER) process.send(message, socket);
    } else {
      // todo
    }
  }

  kill(pid) {
    if (!pid) pid = this._kind !== CHILD_PROCESS_TYPE.MASTER
      ? this._masterPid
      : process.pid;
    process.kill(pid, 'SIGTERM');
  }

  _close() {
    this._closing = true;
    if (this._closingWorkersStatus === 0) {
      for (let i = 0; i < this._workers.length; i++) {
        const worker = this._workers[i];
        worker.close();
      }
      this._closingWorkersStatus = 1;
      return;
    } else if (this._closingWorkersStatus === 1) {
      for (let i = 0; i < this._workers.length; i++) {
        const worker = this._workers[i];
        if (worker.status <= 3) return;
      }
      this._closingWorkersStatus = 2;
    }

    if (this._closingAgentsStatus === 0) {
      for (const agentName in this._agents) {
        this._agents[agentName].close();
      }
      this._closingAgentsStatus = 1;
      return;
    } else if (this._closingAgentsStatus === 1) {
      for (const agentName in this._agents) {
        if (this._agents[agentName].status <= 3) return;
      }
      this._closingAgentsStatus = 2;
    }

    if ([0, 2].indexOf(this._closingSelfStatus) > -1) { return; } 
    else if (this._closingSelfStatus === 1) {
      this._closingSelfStatus = 2;
      if (this._onExit) {
        this._onExit(() => {
          clearInterval(this._timer);
          this._closingSelfStatus = 3;
        });
      } else {
        this._closingSelfStatus = 3;
      }
      return;
    }

    return true;
  }

  onExit(callback) {
    if (typeof callback === 'function') {
      this._onExit = callback;
    }
  }

  createAgent(cwd, name, file, args = {}) {
    if (this._agents[name]) throw new Error('agent is already exist: ' + name);

    const opts = {
      cwd: cwd || process.cwd(),
      env: Object.create(process.env),
      stdio: 'inherit',
      execArgv: process.execArgv.slice(0),
    };

    args.cwd = opts.cwd;
    args.env = opts.env.NODE_ENV || 'production';
    args.script = file;
    args.name = name;
    args.kind = CHILD_PROCESS_TYPE.AGENT;
    args.mpid = this._masterPid;

    const agent = childProcess.fork(scriptFilename, [JSON.stringify(args)], opts);
    const node = new Node(agent, args.kind, name);
    agent.node = node;

    // 启动时候进程退出事件
    const bootstrap_exit_listener = () => node.status = STATUS.BOOTSTRAP_FAILED;
    agent.on('exit', bootstrap_exit_listener);

    // 启动时候接受消息事件
    const bootstrap_message_handler = status => node.status = status;
    agent.on('message', bootstrap_message_handler);

    return new Promise((resolve, reject) => {
      // node 子进程节点状态改变事件
      const node_status_handler = value => {
        switch (value) {
          case STATUS.BOOTSTRAP_FAILED: 
            agent.off('exit', bootstrap_exit_listener);
            agent.off('message', bootstrap_message_handler);
            node.off('status', node_status_handler);
            this.kill();
            reject();
            break;
          case STATUS.BOOTSTRAP_SUCCESS: 
            agent.off('exit', bootstrap_exit_listener);
            agent.off('message', bootstrap_message_handler);
            node.off('status', node_status_handler);
            this._agents[name] = node;
            this._pids[node.pid] = node;
            node.onClose(this);
            node.onCreatedReceiveMessage(this._onMessage.bind(this));
            resolve(node);
            break;
        }
      }
      node.on('status', node_status_handler);
    });
  }

  createWorkerForker(cwd, name, file, args = {}) {
    const opts = {
      cwd: cwd || process.cwd(),
      exec: scriptFilename,
      stdio: 'inherit',
      env: Object.create(process.env),
      execArgv: process.execArgv.slice(0)
    };

    opts.args = [JSON.stringify(Object.assign(args, {
      cwd: opts.cwd,
      env: opts.env.NODE_ENV || 'production',
      script: file,
      name: name,
      kind: CHILD_PROCESS_TYPE.WORKER,
      mpid: this._masterPid,
    }))];

    cluster.setupMaster(opts);

    const fork = () => new Promise((resolve, reject) => {
      const node_handler = node => value => {
        switch (value) {
          case STATUS.BOOTSTRAP_FAILED: 
            cluster
              .off('fork', fork_handler)
              .off('exit', exit_handler)
              .off('message', msg_handler);
            node.off('status', node_handler);
            this.kill();
            reject(); 
            break;
          case STATUS.BOOTSTRAP_SUCCESS: 
            cluster
              .off('fork', fork_handler)
              .off('exit', exit_handler)
              .off('message', msg_handler);
            node.off('status', node_handler);
            this._workers.push(node);
            this._pids[node.pid] = node;
            node.onClose(this);
            node.onCreatedReceiveMessage(this._onMessage.bind(this));
            resolve(node); 
            break;
        }
      }

      const fork_handler = worker => {
        const node = new Node(worker, CHILD_PROCESS_TYPE.WORKER);
        worker.node = node;
        node.on('status', node_handler(node));
      }

      const exit_handler = worker => {
        const node = worker.node;
        if (node) {
          node.status = STATUS.BOOTSTRAP_FAILED;
        }
        if (!this._closing) fork();
      }

      const msg_handler = (worker, code) => {
        const node = worker.node;
        if (node) {
          node.status = code;
        }
      }

      cluster.fork();

      cluster
        .on('fork', fork_handler)
        .on('exit', exit_handler)
        .on('message', msg_handler);
    });

    return fork;
  }
}