import { describe, it, expect } from "vitest";

import { AppError, AuthError, ForbiddenError, DemoModeError, NotFoundError } from "../app-errors";

describe("AppError", () => {
  it("stores message and statusCode", () => {
    const err = new AppError("something broke", 500);
    expect(err.message).toBe("something broke");
    expect(err.statusCode).toBe(500);
    expect(err.name).toBe("AppError");
  });

  it("is an instance of Error", () => {
    const err = new AppError("test", 400);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });
});

describe("AuthError", () => {
  it("defaults to 401 with default message", () => {
    const err = new AuthError();
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Not authenticated");
    expect(err.name).toBe("AuthError");
  });

  it("accepts a custom message", () => {
    const err = new AuthError("Token expired");
    expect(err.message).toBe("Token expired");
    expect(err.statusCode).toBe(401);
  });

  it("is an instance of AppError", () => {
    expect(new AuthError()).toBeInstanceOf(AppError);
  });
});

describe("ForbiddenError", () => {
  it("defaults to 403 with default message", () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe("Not authorized");
    expect(err.name).toBe("ForbiddenError");
  });

  it("accepts a custom message", () => {
    const err = new ForbiddenError("Insufficient permissions");
    expect(err.message).toBe("Insufficient permissions");
    expect(err.statusCode).toBe(403);
  });

  it("is an instance of AppError", () => {
    expect(new ForbiddenError()).toBeInstanceOf(AppError);
  });
});

describe("DemoModeError", () => {
  it("defaults to 403 with demo mode message", () => {
    const err = new DemoModeError();
    expect(err.statusCode).toBe(403);
    expect(err.message).toContain("demo mode");
    expect(err.name).toBe("DemoModeError");
  });

  it("is an instance of AppError", () => {
    expect(new DemoModeError()).toBeInstanceOf(AppError);
  });
});

describe("NotFoundError", () => {
  it("defaults to 404 with default message", () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not found");
    expect(err.name).toBe("NotFoundError");
  });

  it("accepts a custom message", () => {
    const err = new NotFoundError("Contact not found");
    expect(err.message).toBe("Contact not found");
    expect(err.statusCode).toBe(404);
  });

  it("is an instance of AppError", () => {
    expect(new NotFoundError()).toBeInstanceOf(AppError);
  });
});
