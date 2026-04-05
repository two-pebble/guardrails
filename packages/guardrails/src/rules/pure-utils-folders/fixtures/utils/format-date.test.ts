import { describe, expect, test } from "vitest";

describe("format-date", () => {
  test("permits multiple test-only exports in utils folders", () => {
    expect([createIsoDate("2026-03-29"), createReadableDate("March 29, 2026")]).toHaveLength(2);
  });
});

export function createIsoDate(value: string) {
  return value;
}

export function createReadableDate(value: string) {
  return value;
}
