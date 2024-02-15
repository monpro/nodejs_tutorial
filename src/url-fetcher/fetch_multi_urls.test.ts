import { fetchUrl, fetchMultipleUrls } from './fetch_multi_urls'
import * as https from 'https';

jest.mock('https');

// Helper function to generate mock response
const createMockResponse = (statusCode: number, responseData: string, errorCallback?: () => void) => ({
  statusCode,
  on: jest.fn((event, callback) => {
    if (event === 'data') callback(responseData);
    if (event === 'end') {
      callback();
      if (errorCallback) errorCallback();
    }
  })
});

const mockHttpsGet = (statusCode: number, responseData: string, errorCallback?: () => void) => {
  const mockResponse = createMockResponse(statusCode, responseData, errorCallback);
  (https.get as jest.Mock).mockImplementation((_, callback) => {
    callback(mockResponse);
    return mockResponse;
  });
};


describe('fetchUrl function', () => {
  test('should fetch data from a single URL', async () => {
    const url = 'https://example.com';
    const responseData = 'Response Data';
    mockHttpsGet(200, responseData)

    const result = await fetchUrl(url);
    expect(result.url).toBe(url);
    expect(result.status).toBe(200);
    expect(result.body).toBe(responseData);
    expect(result.error).toBeUndefined();
  });

  test('should handle errors when fetching data from a single URL', async () => {
    const url = 'https://example.com';
    const errorMessage = 'Error Message';

    // Mocking https.get to directly trigger the error callback
    mockHttpsGet(200, 'responseData', () => {
      throw new Error(errorMessage);
    });


    // Expecting fetchUrl to throw an error with the expected error message
    try {
      // Call fetchUrl and expect it to throw an error
      await fetchUrl(url);
    } catch (error) {
      // Verify that the error message matches the expected error message
      expect(error).toEqual({
        url,
        error: errorMessage
      });
    }
  })
});

describe('fetchMultipleUrls function', () => {
  test('should fetch data from multiple URLs', async () => {
    const urls = ['https://example.com', 'https://anotherexample.com'];
    const responseData = 'Response Data';
    mockHttpsGet(200, responseData)

    const results = await fetchMultipleUrls(urls);
    expect(results).toHaveLength(urls.length);
    results.forEach(result => {
      expect(result.status).toBe(200);
      expect(result.body).toBe(responseData);
      expect(result.error).toBeUndefined();
    });
  });

  test('should handle errors when fetching data from multiple URLs', async () => {
    const urls = ['https://example.com', 'https://invalidurl'];
    const errorMessage = 'Error Message';
    // Mocking https.get to directly trigger the error callback
    mockHttpsGet(200, 'responseData', () => {
      throw new Error(errorMessage);
    });

    try {
      // Call fetchMultipleUrls and expect it to throw an error
      await fetchMultipleUrls(urls);
    } catch (error) {
      // Verify that the error message matches the expected error message
      expect(error).toEqual(expect.objectContaining({ error: errorMessage }));
    }
  });
});
