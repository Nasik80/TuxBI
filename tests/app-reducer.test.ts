import { describe, expect, it } from "vitest";
import {
  applicationReducer,
  initialApplicationState,
} from "../src/state/app-reducer";

describe("applicationReducer", () => {
  it("selects a workspace and communicates its planned availability", () => {
    const nextState = applicationReducer(initialApplicationState, {
      type: "select-view",
      view: "data",
    });

    expect(nextState.activeView).toBe("data");
    expect(nextState.statusMessage).toContain("0.1B");
    expect(nextState.theme).toBe("light");
  });
});
