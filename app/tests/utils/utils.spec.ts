import { extractAllowedFields } from "../../src/utils/utils";

describe("utils", () => {
  it("should extract allowed fields", () => {
    expect(extractAllowedFields(["a", "b"], { a: 1, b: 2, c: 3 })).toEqual({
      a: 1,
      b: 2,
    });
  });
});
