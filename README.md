# @nelts/cli

`nelts`架构的辅助进程工具，通过这个工具可以启动nelts工程。

## Usage

在项目中安装工具

```bash
npm i @nelts/cli
```

开发模式下启动

```bash
node node_modules/@nelts/cli/src/script.js --script={start file name}
```

生产环境下启动，建议使用[PM2](https://www.npmjs.com/package/pm2)启动。

```bash
pm2 start node_modules/@nelts/cli/src/script.js --name={name} -- --script={start file name}
```

## Lifecycle

每个启动的进程对应一个script文件地址，它具有以下的生命周期：

- `componentWillCreate` 进程启动前执行函数 此时 *messager* 不可用
- `componentDidCreated` 进程启动完毕执行函数 此时 *messager* 可用
- `componentWillDestroy` 进程结束前执行函数 此时 *messager* 可用
- `componentDidDestroyed` 进程结束后执行函数 此时 *messager* 不可用
- `componentCatchError` 统一错误捕获 参数为 `error: Error`
- `componentReceiveMessage` 统一消息接受函数 `(message, socket) => {}`

script文件内容必须是一个返回的class对象

eg:

```javascript
module.exports = class {
  async componentWillCreate() {}
  async componentDidCreated() {}
  async componentWillDestroy() {}
  async componentDidDestroyed() {}
  componentCatchError(err) {}
  componentReceiveMessage(message, socket) {}
}
```

它具有以下隐式方法

- `this.send()` 发送消息
- `this.kill()` 杀掉进程
- `this.createAgent()` 创建子agent进程
- `this.createWorkerForker()` 创建子worker进程

## this.send(message: object, socket: Socket)

- `message` {object} 消息体 `{ to, event, data }`
- `socket` socket对象

发送消息

```javascript
this.send({
  to: 'test',
  event: 'abc',
  data: {
    a: 1
  }
});
```

## this.kill([pid: number])

杀掉自身进程或者指定进程，或者全局结束所有进程

- `pid` 进程ID。如果省略就是杀掉所有相关进程。

```javascript
this.kill(process.pid);
this.kill();
```

## this.createAgent(name: string, file: string)

创建一个agent进程

- `name` 进程名
- `file` 进程执行文件地址

```javascript
const agent = await this.createAgent('test', 'test/file.js');
// agent 就是对应的Node进程节点
```

## this.createWorkerForker(file: string)

创建一个worker进程forker。

- `file` 进程执行文件地址

```javascript
const fork = this.createWorkerForker('test/worker.js');
await fork();
await fork();
await fork();
await fork();
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, yunjie (Evio) shen