// Adapted from https://github.com/observablehq/stdlib/tree/e9e9a6f3

export default function tick(duration, value) {
  return when(Math.ceil((Date.now() + 1) / duration) * duration, value);
}

var timeouts = new Map();

function timeout(now, time) {
  var t = new Promise(function (resolve) {
    timeouts.delete(time);
    var delay = time - now;
    if (!(delay > 0)) throw new Error("invalid time");
    if (delay > 0x7fffffff) throw new Error("too long to wait");
    setTimeout(resolve, delay);
  });
  timeouts.set(time, t);
  return t;
}

function when(time, value) {
  var now;
  return (now = timeouts.get((time = +time)))
    ? now.then(value)
    : (now = Date.now()) >= time
    ? Promise.resolve(value)
    : timeout(now, time).then(value);
}
