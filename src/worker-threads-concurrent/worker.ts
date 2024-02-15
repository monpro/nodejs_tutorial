import {parentPort} from 'worker_threads';

// Define the type for the data chunk
interface DataChunk {
  data: string; // Assuming the chunk is a simple object with a string data property for demonstration
}


// Arrow function with type annotation for processData
const processData = (chunk: string): Promise<string> => new Promise((resolve) => {
  const delay = Math.floor(Math.random() * 1000)
  setTimeout(() => resolve(`${chunk} processed`), delay)
});

if (parentPort) {
  parentPort.on('message', async (chunk: DataChunk) => {
    try {
      const result = await processData(chunk.data)
      parentPort?.postMessage(result)
    } catch (error: any) {
      parentPort?.postMessage(`Error processing chunk: ${error.message}`);
    }
  });
} else {
  console.log("not parent port")
}
