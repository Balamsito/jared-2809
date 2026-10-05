import { describe, it, expect, beforeEach } from "vitest";
import { register, login, logout, getSession } from "../../src/services/auth.service";

beforeEach(() => {
  localStorage.clear();
});

describe("auth.service — register", () => {
  it("registers a new user and stores hashed password (never plaintext)", async () => {
    const result = await register("test@test.com", "Tester", "password123");
    expect(result.success).toBe(true);

    // Verify no plaintext password in storage
    const raw = localStorage.getItem("snailbet:users");
    expect(raw).toBeTruthy();
    expect(raw).not.toContain("password123");

    // Verify hash structure exists
    if (result.success) {
      const parsed = JSON.parse(result.user.passwordHash);
      expect(parsed).toHaveProperty("salt");
      expect(parsed).toHaveProperty("hash");
      expect(parsed.hash).not.toBe("password123");
      expect(parsed.hash.length).toBe(64); // SHA-256 hex = 64 chars
    }
  });

  it("rejects duplicate email registration", async () => {
    await register("dup@test.com", "User1", "pass123");
    const result = await register("DUP@TEST.COM", "User2", "pass456");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("registrado");
    }
  });
});

describe("auth.service — login", () => {
  it("returns session on correct credentials", async () => {
    await register("login@test.com", "LoginUser", "correct_pass");
    const result = await login("login@test.com", "correct_pass");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.session.isAuthenticated).toBe(true);
      expect(result.session.email).toBe("login@test.com");
      expect(result.session.displayName).toBe("LoginUser");
    }
  });

  it("rejects wrong password", async () => {
    await register("pw@test.com", "PwUser", "rightpass");
    const result = await login("pw@test.com", "wrongpass");
    expect(result.success).toBe(false);
  });

  it("rejects non-existent email", async () => {
    const result = await login("ghost@test.com", "anypass");
    expect(result.success).toBe(false);
  });

  it("persists session to localStorage on successful login", async () => {
    await register("persist@test.com", "PersistUser", "pass123");
    await login("persist@test.com", "pass123");
    const session = getSession();
    expect(session).not.toBeNull();
    expect(session?.isAuthenticated).toBe(true);
  });
});

describe("auth.service — logout", () => {
  it("clears session from localStorage", async () => {
    await register("logout@test.com", "LogUser", "pass123");
    await login("logout@test.com", "pass123");
    expect(getSession()).not.toBeNull();
    logout();
    expect(getSession()).toBeNull();
  });
});

describe("auth.service — security: localStorage never contains plaintext password", () => {
  it("scans all localStorage keys for plaintext password", async () => {
    const pw = "super_secret_password_123";
    await register("sec@test.com", "SecUser", pw);
    await login("sec@test.com", pw);

    const allStorage = Object.keys(localStorage)
      .map((k) => localStorage.getItem(k) ?? "")
      .join(" ");

    expect(allStorage).not.toContain(pw);
  });
});
