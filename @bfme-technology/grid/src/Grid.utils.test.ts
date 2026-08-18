import { getSystemTheme, getResolvedTheme, getThemeCssVariables, renderCell } from "./Grid.utils";

describe("Grid.utils", () => {
  describe("getSystemTheme", () => {
    it("returns light when window is undefined", () => {
      const origWindow = global.window;
      // @ts-ignore
      delete global.window;
      expect(getSystemTheme()).toBe("light");
      global.window = origWindow;
    });
  });

  describe("getResolvedTheme", () => {
    it("returns explicit light or dark", () => {
      expect(getResolvedTheme("light")).toBe("light");
      expect(getResolvedTheme("dark")).toBe("dark");
    });
  });

  describe("getThemeCssVariables", () => {
    it("returns dark theme css variables", () => {
      const vars = getThemeCssVariables("dark");
      expect(vars["--bg-surface"]).toBe("#1e293b");
    });

    it("returns light theme css variables", () => {
      const vars = getThemeCssVariables("light");
      expect(vars["--bg-surface"]).toBe("#ffffff");
    });
  });

  describe("renderCell", () => {
    it("returns empty string when col is undefined", () => {
      // @ts-ignore
      expect(renderCell(undefined, {}, 0)).toBe("");
    });

    it("returns formatted string value when cellRenderer is absent", () => {
      expect(renderCell({ field: "name" }, { name: "Test" }, 0)).toBe("Test");
    });

    it("invokes cellRenderer if provided as a function", () => {
      const col = {
        field: "name",
        cellRenderer: ({ value }: any) => `Hello ${value}`,
      };
      expect(renderCell(col, { name: "World" }, 0)).toBe("Hello World");
    });
  });
});
