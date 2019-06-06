module.exports = class {
  async componentWillCreate() {
    console.log('index: in')
    // // throw new Error('xx')
  }

  async componentDidCreated() {
    console.log('index: in2')
    // throw new Error('xx2')
    const fork = this.createWorkerForker('test/worker.js');
    await this.createAgent('test', 'test/file.js');
    await fork();
  }

  async componentWillDestroy() {
    console.log('index: out');
  }

  async componentDidDestroyed() {
    console.log('index: out2')
  }

  componentCatchError(err) {
    console.log(err)
  }

  componentReceiveMessage() {

  }
}