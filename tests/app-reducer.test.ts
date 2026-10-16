import { describe, expect, it } from "vitest";
import {
  applicationReducer,
  initialApplicationState,
} from "../src/state/app-reducer";

describe("applicationReducer", () => {
  it("opens on Home by default", () => {
    expect(initialApplicationState.activeView).toBe("home");
  });

  it("selects a workspace and communicates its planned availability", () => {
    const nextState = applicationReducer(initialApplicationState, {
      type: "select-view",
      view: "data",
    });

    expect(nextState.activeView).toBe("data");
    expect(nextState.statusMessage).toBe("Data workspace selected.");
    expect(nextState.theme).toBe("light");
  });
});
