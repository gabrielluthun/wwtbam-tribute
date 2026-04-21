export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Attend la fin du son (ou minMs si plus long), cappe à maxMs */
export const waitForSound = (soundPromise, minMs = 0, maxMs = 8000) =>
  Promise.race([
    Promise.all([Promise.resolve(soundPromise), sleep(minMs)]),
    sleep(maxMs),
  ]);
