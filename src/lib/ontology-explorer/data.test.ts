import { describe, expect, it } from "vitest";
import {
  childrenOf,
  ontologyVersions,
  propertiesWithDomain,
  rootsOf,
  searchTerms,
  subtreeHasLayer,
  terms,
} from "./data";

describe("ontology explorer data", () => {
  it("covers the three ontologies", () => {
    expect(Object.keys(ontologyVersions).sort()).toEqual(["agents", "frame", "top"]);
  });

  it("labels every term in both languages", () => {
    for (const term of terms.values()) {
      expect(term.label.it, term.id).not.toBe("");
      expect(term.label.en, term.id).not.toBe("");
    }
  });

  it("lists a term with several parents under each of them", () => {
    expect(childrenOf("top:Event", "en")).toContain("agents:SpeechAct");
    expect(childrenOf("top:Information", "en")).toContain("agents:SpeechAct");
  });

  it("roots the class tree at the non-disjoint continuant and occurrent", () => {
    expect(rootsOf("classes", "en")).toEqual(["top:Continuant", "top:Occurrent"]);
  });

  it("hooks frame roles into the top-level participation relations", () => {
    expect(childrenOf("top:has_participant", "en")).toContain("frame:core_role");
    expect(subtreeHasLayer("top:relatedness", "frame")).toBe(true);
  });

  it("finds properties by domain and terms by label in either language", () => {
    expect(propertiesWithDomain("agents:SpeechAct", "en")).toContain("agents:originator");
    expect(searchTerms("atto linguistico", "it")).toEqual(["agents:SpeechAct"]);
    expect(searchTerms("speech act", "en")).toEqual(["agents:SpeechAct"]);
  });
});
