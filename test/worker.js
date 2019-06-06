module.exports = class {
  async componentWillCreate() {
    console.log(process.pid, 'worker: in')
    // throw new Error('xx')
  }

  async componentDidCreated() {
    console.log(process.pid, 'worker: in2')
    // throw new Error('xx2')
  }

  async componentWillDestroy() {
    console.log(process.pid, 'worker: out');
  }

  async componentDidDestroyed() {
    console.log(process.pid, 'worker: out2')
  }

  componentCatchError(err) {
    console.log(err)
  }

  componentReceiveMessage() {
    
  }
}