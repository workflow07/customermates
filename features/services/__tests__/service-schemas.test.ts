import { describe, it, expect } from "vitest";

import { BaseCreateServiceSchema } from "../upsert/create-service-base.schema";
import { BaseUpdateServiceSchema } from "../upsert/update-service-base.schema";

const VALID_UUID = "00000000-0000-4000-8000-000000000001";

describe("BaseCreateServiceSchema", () => {
  it("accepts valid minimal data", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: 100,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Consulting");
      expect(result.data.amount).toBe(100);
      expect(result.data.userIds).toEqual([]);
      expect(result.data.dealIds).toEqual([]);
      expect(result.data.customFieldValues).toEqual([]);
    }
  });

  it("accepts full data with all optional fields", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: 250.5,
      notes: "Hourly rate",
      userIds: [VALID_UUID],
      dealIds: [VALID_UUID],
      customFieldValues: [{ columnId: VALID_UUID, value: "premium" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "",
      amount: 100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = BaseCreateServiceSchema.safeParse({
      amount: 100,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing amount", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: -50,
    });
    expect(result.success).toBe(false);
  });

  it("accepts decimal amounts", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: 99.99,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.amount).toBe(99.99);
  });

  it("rejects non-numeric amount", () => {
    const result = BaseCreateServiceSchema.safeParse({
      name: "Consulting",
      amount: "hundred",
    });
    expect(result.success).toBe(false);
  });
});

describe("BaseUpdateServiceSchema", () => {
  it("accepts valid update with id only", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial name update", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      name: "Updated Service",
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial amount update", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      amount: 200,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      name: "Updated",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount when provided", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      amount: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount when provided", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      amount: -10,
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for nullable array fields", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      userIds: null,
      dealIds: null,
      customFieldValues: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name when provided", () => {
    const result = BaseUpdateServiceSchema.safeParse({
      id: VALID_UUID,
      name: "",
    });
    expect(result.success).toBe(false);
  });
});
