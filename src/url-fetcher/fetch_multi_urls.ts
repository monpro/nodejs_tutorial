import * as https from 'https';

interface FetchResult {
  url: string;
  status?: number;
  body?: string;
  error?: string;
}

export const fetchUrl = async (url: string): Promise<FetchResult> => {
  // fetch the url and parse the result for data, end, error status
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          body: data
        })
      })
    }).on('error', err => {
      reject({
        url,
        error: err.message
      })
    })
  })
}

export const fetchMultipleUrls = async (urls: string[]): Promise<FetchResult[]> => {
  const urlsPromise = urls.map(url => fetchUrl(url))
  return await Promise.all(urlsPromise)
};

const urls: string[] = [
  'https://swapi.dev/api/planets/3/?format=json', // Star Wars API: Information about planets
  'https://techcrunch.com/wp-json/wp/v2/posts?per_page=5&context=embed', // WordPress API: Fetch recent posts from TechCrunch
];

(async () => {
  try {
    const results = await fetchMultipleUrls(urls);
    console.log('Results:', results.map(result => ({
      url: result.url,
      status: result.status,
      snippet: result.body?.substring(0, 100) + '...' // Display a snippet to avoid showing the entire body
    })));
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
