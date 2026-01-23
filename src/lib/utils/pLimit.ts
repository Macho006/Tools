export function pLimit(concurrency: number) {
  let activeCount = 0;
  const queue: Array<() => void> = [];

  const next = () => {
    activeCount--;
    if (queue.length) queue.shift()!();
  };

  const run = async <T>(fn: () => Promise<T>, resolve: (v: T) => void, reject: (e: any) => void) => {
    activeCount++;
    try {
      const result = await fn();
      resolve(result);
    } catch (e) {
      reject(e);
    } finally {
      next();
    }
  };

  return function limit<T>(fn: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      const task = () => run(fn, resolve, reject);
      if (activeCount < concurrency) task();
      else queue.push(task);
    });
  };
}
