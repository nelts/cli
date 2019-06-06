module.exports = class {
  async componentWillCreate() {
    console.log('file: in')
    // throw new Error('xx')
  }

  async componentDidCreated() {
    console.log('file: in2')
    // throw new Error('xx2')
  }

  async componentWillDestroy() {
    console.log('file: out');
  }

  async componentDidDestroyed() {
    console.log('file: out2')
  }

  componentCatchError(err) {
    console.log(err)
  }

  componentReceiveMessage() {

  }
}