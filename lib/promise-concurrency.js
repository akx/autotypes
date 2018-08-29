/*
  Based on https://github.com/springuper/promise-concurrency (f450a27b78)
  which is licensed under the MIT license.
*/

const call = value => value();
const noopProgressCallback = ({
  results,
  queue,
  done,
  remaining,
  inFlight,
}) => void 8;

const promiseConcurrency = (
  queue,
  limit,
  factory = call,
  progressCallback = noopProgressCallback,
  failFast = true,
) => {
  const len = queue.length;
  if (len === 0) {
    return Promise.resolve();
  }

  const results = new Array(len);
  let resolveAll;
  let rejectAll;
  let rejected = false;
  const promise = new Promise((resolve, reject) => {
    resolveAll = resolve;
    rejectAll = reject;
  });

  let index = 0;
  let done = 0;
  let inFlight = 0;

  function release() {
    done++;
    inFlight--;
    progressCallback({
      results,
      queue,
      done,
      remaining: len - done,
      inFlight,
    });

    if (rejected) {
      if (failFast && inFlight === 0) {
        // Wait for promises in flight to finish
        rejectAll(results);
      }
      return;
    }
    if (done === len) {
      if (!rejected) {
        resolveAll(results);
      } else {
        rejectAll(results);
      }
      return;
    }

    if (queue.length) {
      next();
    }
  }

  function run(item, index) {
    inFlight++;
    factory(item).then(
      value => {
        results[index] = value;
        release();
      },
      reason => {
        results[index] = { $reject: reason, item };
        rejected = true;
        release();
      },
    );
  }

  function next() {
    run(queue.shift(), index++);
  }

  while (queue.length && inFlight < limit) {
    next();
  }

  return promise;
};

module.exports = promiseConcurrency;
