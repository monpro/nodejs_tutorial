### Overview
This Node.js program demonstrates how to fetch data from multiple URLs using the HTTPS module.
It provides an asynchronous function fetchUrl to fetch data from a single URL and another function fetchMultipleUrls
to fetch data from multiple URLs concurrently.


### Program Overview
The fetchUrl function takes a single URL as input and returns a Promise that resolves to an object containing the URL, status code, response body, and error message (if any).

The fetchMultipleUrls function accepts an array of URLs and returns a Promise that resolves to an array of fetch results for each URL.

The program fetches data from two example URLs: one from the Star Wars API and another from the WordPress API, demonstrating how to fetch data from different sources.

The results are logged to the console, displaying the URL, status code, and a snippet of the response body to provide a brief overview of the fetched data.


### Dependencies
This program uses the built-in https module provided by Node.js, so there are no external dependencies to install.
