import {AsyncCache} from "./AsyncCache";


describe("AsyncCache", () => {
  let asyncCache: AsyncCache<string, number>

  beforeEach(() => {
    asyncCache = new AsyncCache<string, number>(10000);
  })


  test("should fetch and cache the data", async () => {
    const asyncOperationMock = jest.fn().mockResolvedValue(123)
    const key = "test"

    const result = await asyncCache.getOrSet(key, asyncOperationMock)

    expect(result).toBe(123)
    expect(asyncOperationMock).toHaveBeenCalledTimes(1)

    const cachedResult = await asyncCache.getOrSet(key, asyncOperationMock)

    expect(cachedResult).toBe(123)
    expect(asyncOperationMock).toHaveBeenCalledTimes(1)
  })
})
