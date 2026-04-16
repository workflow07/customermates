import { describe, it, expect } from "vitest";

import { BaseCreateOrganizationSchema } from "../upsert/create-organization-base.schema";
import { BaseUpdateOrganizationSchema } from "../upsert/update-organization-base.schema";

const VALID_UUID = "00000000-0000-4000-8000-000000000001";

describe("BaseCreateOrganizationSchema", () => {
  it("accepts valid minimal data", () => {
    const result = BaseCreateOrganizationSchema.safeParse({
      name: "Acme Corp",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Acme Corp");
      expect(result.data.contactIds).toEqual([]);
      expect(result.data.userIds).toEqual([]);
      expect(result.data.dealIds).toEqual([]);
      expect(result.data.customFieldValues).toEqual([]);
    }
  });

  it("accepts full data with all optional fields", () => {
    const result = BaseCreateOrganizationSchema.safeParse({
      name: "Acme Corp",
      notes: "Enterprise client",
      contactIds: [VALID_UUID],
      userIds: [VALID_UUID],
      dealIds: [VALID_UUID],
      customFieldValues: [{ columnId: VALID_UUID, value: "tech" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = BaseCreateOrganizationSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = BaseCreateOrganizationSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUID in contactIds", () => {
    const result = BaseCreateOrganizationSchema.safeParse({
      name: "Acme",
      contactIds: ["not-valid"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts null notes", () => {
    const result = BaseCreateOrganizationSchema.safeParse({
      name: "Acme",
      notes: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("BaseUpdateOrganizationSchema", () => {
  it("accepts valid update with id only", () => {
    const result = BaseUpdateOrganizationSchema.safeParse({
      id: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial name update", () => {
    const result = BaseUpdateOrganizationSchema.safeParse({
      id: VALID_UUID,
      name: "New Name",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("New Name");
  });

  it("rejects missing id", () => {
    const result = BaseUpdateOrganizationSchema.safeParse({
      name: "Updated",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for nullable array fields", () => {
    const result = BaseUpdateOrganizationSchema.safeParse({
      id: VALID_UUID,
      contactIds: null,
      userIds: null,
      dealIds: null,
      customFieldValues: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name when provided", () => {
    const result = BaseUpdateOrganizationSchema.safeParse({
      id: VALID_UUID,
      name: "",
    });
    expect(result.success).toBe(false);
  });
});
