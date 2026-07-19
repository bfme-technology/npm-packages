import { getNameFromURI } from "./breadcrumb.utils";

describe("breadcrumb utils", () => {
  describe("getNameFromURI", () => {
    test("should return the last segment of the URI", () => {
      expect(getNameFromURI("/dashboard")).toBe("Dashboard");
      expect(getNameFromURI("/add-credit")).toBe("Add Credit");
      expect(getNameFromURI("/")).toBe("");
      expect(getNameFromURI("/add-products")).toBe("Add Products");
    });
  });
});
