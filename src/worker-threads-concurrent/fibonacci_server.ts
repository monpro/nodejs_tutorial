import { Worker, isMainThread, parentPort } from 'worker_threads';

// Using arrow function with type annotation for the Fibonacci calculation
export const calculateFibonacci = (number: number): number => {
  if (number < 2) return number;
  return calculateFibonacci(number - 1) + calculateFibonacci(number - 2);
};

if (isMainThread) {
  // Main thread using TypeScript features
  const worker = new Worker(__filename);
  const number = 40; // Example of a large number for Fibonacci calculation

  worker.on('message', (result: number) => {
    console.log(`Fibonacci result for ${number}: ${result}`);
  });

  worker.on('error', (error: Error) => {
    console.error('Worker error:', error);
  });

  worker.on('exit', (code: number) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });

  worker.postMessage(number);
} else {
  // Worker thread using arrow function with type annotation for the message event
  parentPort?.on('message', (number: number) => {
    const result = calculateFibonacci(number);
    parentPort?.postMessage(result);
  });
}
