import { getYesterdayRangeInMillis } from "./time-util";
import { equal } from "assert";

describe("Time Utils", () => {
  it("24 hours ago should be in the range of yesterday timestamps", async () => {
    const now = Date.now();
    const res = getYesterdayRangeInMillis(now);
    const ago24hours = now - 24 * 3600 * 1000;
    equal(res.start < ago24hours && ago24hours < res.end, true);
  });
});