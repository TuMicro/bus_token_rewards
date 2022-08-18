import requestPromise from "request-promise";
// import requestPromise = require("request-promise"); // Old version of importing

export async function downloadToBuffer(url: string) : Promise<Buffer> {
  const buffer = (await requestPromise({
    url: url,
    encoding: null, // to get the raw buffer, otherwise it will be a string (which corrupts data in case of image files)
  }));
  return buffer;
}