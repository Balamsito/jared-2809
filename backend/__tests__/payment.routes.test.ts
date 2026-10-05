import request from "supertest";
import app from "../src/app";

const VALID_PAYLOAD = {
  card_number: "1234123412341234",
  expiration: "12/26",
  cvv: "543",
  card_holder: "Juan Caracol",
  amount: 50,
  payer_id: "usr_test_001",
  payer_email: "test@snailbet.com",
};

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE SCHEMA HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function expectResponseSchema(body: Record<string, unknown>) {
  const requiredKeys = [
    "id", "status", "status_detail", "transaction_amount",
    "date_created", "authorization_code", "reference",
    "payer_id", "payer_email",
  ];
  for (const key of requiredKeys) {
    expect(body).toHaveProperty(key);
  }
}

function expectNoSensitiveData(body: Record<string, unknown>) {
  const bodyStr = JSON.stringify(body);
  // CRITICAL: card number and CVV must NEVER appear in any response
  expect(bodyStr).not.toContain("1234123412341234");
  expect(bodyStr).not.toContain("543");
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 1 — SUCCESS (approved)
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments — Scenario 1: Approved", () => {
  it("returns 201 with status=approved for the magic card", async () => {
    const res = await request(app).post("/api/payments").send(VALID_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("approved");
    expect(res.body.status_detail).toBe("accredited");
    expect(res.body.authorization_code).toBeTruthy();
    expect(res.body.transaction_amount).toBe(50);
    expect(res.body.payer_id).toBe("usr_test_001");
    expect(res.body.payer_email).toBe("test@snailbet.com");
    expectResponseSchema(res.body);
    expectNoSensitiveData(res.body);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 2 — DECLINED CARD (rejected)
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments — Scenario 2: Card Declined", () => {
  it("returns 402 for a different card number", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, card_number: "9999999999999999" });
    expect(res.status).toBe(402);
    expect(res.body.status).toBe("rejected");
    expect(res.body.status_detail).toBe("cc_rejected_other_reason");
    expect(res.body.authorization_code).toBeNull();
    expectNoSensitiveData(res.body);
  });

  it("returns 402 for correct card but wrong CVV", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, cvv: "999" });
    expect(res.status).toBe(402);
    expect(res.body.status).toBe("rejected");
    expectNoSensitiveData(res.body);
  });

  it("returns 402 for correct card but wrong expiration", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, expiration: "11/26" });
    expect(res.status).toBe(402);
    expect(res.body.status).toBe("rejected");
    expectNoSensitiveData(res.body);
  });

  it("returns 402 for expired card", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, expiration: "01/20" });
    expect(res.status).toBe(402);
    expect(res.body.status_detail).toBe("cc_rejected_card_expired");
    expectNoSensitiveData(res.body);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SCENARIO 3 — SYSTEM ERROR (reproducible via header)
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments — Scenario 3: System Error", () => {
  it("returns 500 when x-simulate-error header is true", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("x-simulate-error", "true")
      .send(VALID_PAYLOAD);
    expect(res.status).toBe(500);
    expect(res.body.status).toBe("error");
    expect(res.body.status_detail).toBe("internal_server_error");
    expect(res.body.authorization_code).toBeNull();
    expectNoSensitiveData(res.body);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION ERRORS
// ─────────────────────────────────────────────────────────────────────────────

describe("POST /api/payments — Validation Errors", () => {
  it("returns 400 for missing required fields", async () => {
    const res = await request(app).post("/api/payments").send({
      card_number: "1234123412341234",
    });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("missing_required_fields");
    expect(res.body.missing).toBeInstanceOf(Array);
  });

  it("returns 400 for card number that is not 16 digits", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, card_number: "123" });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("invalid_card_number");
    expectNoSensitiveData(res.body);
  });

  it("returns 400 for CVV that is not 3 digits", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, cvv: "12" });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("cc_rejected_bad_cvv");
    expectNoSensitiveData(res.body);
  });

  it("returns 400 for invalid expiration format", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, expiration: "13/26" });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("invalid_expiration_format");
  });

  it("returns 400 for amount = 0", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, amount: 0 });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("invalid_amount");
  });

  it("returns 400 for negative amount", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYLOAD, amount: -10 });
    expect(res.status).toBe(400);
    expect(res.body.status_detail).toBe("invalid_amount");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY: Response Schema Enforcement
// ─────────────────────────────────────────────────────────────────────────────

describe("Security: Sensitive data MUST NOT appear in any response", () => {
  const scenarios = [
    { label: "approved", payload: VALID_PAYLOAD },
    { label: "declined", payload: { ...VALID_PAYLOAD, card_number: "9999999999999999" } },
    {
      label: "system error",
      payload: VALID_PAYLOAD,
      headers: { "x-simulate-error": "true" },
    },
  ];

  for (const scenario of scenarios) {
    it(`${scenario.label}: body does not contain card_number or cvv`, async () => {
      const req = request(app).post("/api/payments");
      if (scenario.headers) {
        for (const [k, v] of Object.entries(scenario.headers)) {
          req.set(k, v);
        }
      }
      const res = await req.send(scenario.payload);
      expectNoSensitiveData(res.body);
    });
  }
});
