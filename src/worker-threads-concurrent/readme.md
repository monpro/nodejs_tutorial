## Worker Threads and Concurrent Processing
This repository demonstrates the usage of Node.js worker_threads module for parallel processing and concurrent execution of tasks. It includes examples of:

### Fibonacci Calculation:

The main thread spawns a worker thread to calculate the Fibonacci sequence for a large number.
The worker thread performs the calculation recursively.
Communication between the main thread and the worker thread is handled through messages.

### Contents
fibonacci_server.ts: Contains code for calculating Fibonacci sequence using worker threads.

worker.ts: Worker thread script used by concurrent_processing.ts for processing data chunks.
