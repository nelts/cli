exports.STATUS = {
  BOOTSTRAPING: 0,
  BOOTSTRAP_FAILED: 1,
  BOOTSTRAP_SUCCESS: 2,
  CLOSING: 3,
  CLOSE_FAILED: 4,
  CLOSE_SUCCESS: 5
}

exports.CHILD_PROCESS_TYPE = {
  MASTER: 0,
  WORKER: 1,
  AGENT: 2
}

exports.safeClose = callback => {
  let closing = false;
  process.on('SIGTERM', delayUntil);
  process.on('SIGINT', delayUntil);
  process.on('SIGQUIT', delayUntil);
  function delayUntil() {
    if (closing) return;
    closing = true;
    const timer = setInterval(() => {
      if (callback()) {
        clearInterval(timer);
        process.exit(0);
      }
    }, 33.33);
  }
}