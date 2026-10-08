import { describe, expect, it } from "vitest";
import { terms } from "./data";
import { hashForTerm, termIdFromHash } from "./deep-link";

describe("explorer deep links", () => {
  it("reads a term id from the fragment", () => {
    expect(termIdFromHash("#top:Agent")).toBe("top:Agent");
  });

  it("accepts a fragment without the leading #", () => {
    expect(termIdFromHash("agents:SpeechAct")).toBe("agents:SpeechAct");
  });

  it("decodes a percent-encoded fragment", () => {
    expect(termIdFromHash("#top%3AAgent")).toBe("top:Agent");
  });

  it.each(["", "#"])("returns null for an empty fragment (%j)", (hash) => {
    expect(termIdFromHash(hash)).toBeNull();
  });

  it("returns null for an unknown term", () => {
    expect(termIdFromHash("#top:NoSuchClass")).toBeNull();
  });

  it("returns null for a malformed escape instead of throwing", () => {
    expect(termIdFromHash("#%E0%A4%A")).toBeNull();
  });

  it("round-trips every term", () => {
    for (const id of terms.keys()) {
      expect(termIdFromHash(hashForTerm(id)), id).toBe(id);
    }
  });
});
