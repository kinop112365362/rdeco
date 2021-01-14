export const log = (...args) => {
  if (log.debugger) {
    console.log(...args);
  }
};
log.debugger = false;
