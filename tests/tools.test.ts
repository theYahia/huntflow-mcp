import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set token before importing modules
process.env.HUNTFLOW_TOKEN = "test-token-123";

import { handleListVacancies } from "../src/tools/vacancies.js";
import { handleSearchApplicants, handleGetApplicant } from "../src/tools/applicants.js";
import { handleGetApplicantResumes } from "../src/tools/resumes.js";
import { handleListStages } from "../src/tools/stages.js";
import { handleListAccounts } from "../src/tools/accounts.js";

function mockOk(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => data,
  });
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe("list_vacancies", () => {
  it("calls correct URL with opened=true", async () => {
    mockOk({ items: [{ id: 1, position: "Dev" }] });
    const result = await handleListVacancies({ account_id: 42, opened: true, count: 10 });
    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/accounts/42/vacancies");
    expect(url).toContain("opened=true");
    expect(url).toContain("count=10");
    const parsed = JSON.parse(result);
    expect(parsed.items[0].position).toBe("Dev");
  });

  it("uses correct base URL (huntflow.ru)", async () => {
    mockOk({ items: [] });
    await handleListVacancies({ account_id: 1, opened: true, count: 30 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toMatch(/^https:\/\/api\.huntflow\.ru\/v2/);
  });
});

describe("search_applicants", () => {
  it("passes query param", async () => {
    mockOk({ items: [{ id: 5, first_name: "Иван" }] });
    const result = await handleSearchApplicants({ account_id: 42, q: "Иван", count: 30 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("q=%D0%98%D0%B2%D0%B0%D0%BD");
    expect(JSON.parse(result).items[0].first_name).toBe("Иван");
  });
});

describe("get_applicant", () => {
  it("calls correct path", async () => {
    mockOk({ id: 7, first_name: "Мария", last_name: "К" });
    await handleGetApplicant({ account_id: 42, applicant_id: 7 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/accounts/42/applicants/7");
  });
});

describe("get_applicant_resumes", () => {
  it("calls externals endpoint", async () => {
    mockOk({ items: [{ id: 1, auth_type: "HH" }] });
    const result = await handleGetApplicantResumes({ account_id: 42, applicant_id: 7 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/accounts/42/applicants/7/externals");
    expect(JSON.parse(result).items[0].auth_type).toBe("HH");
  });
});

describe("list_stages", () => {
  it("calls vacancy statuses endpoint", async () => {
    mockOk({ items: [{ id: 1, name: "Новый", order: 0 }] });
    const result = await handleListStages({ account_id: 42 });
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/accounts/42/vacancy/statuses");
    expect(JSON.parse(result).items[0].name).toBe("Новый");
  });
});

describe("list_accounts", () => {
  it("calls /accounts", async () => {
    mockOk({ items: [{ id: 1, name: "TestCo" }] });
    const result = await handleListAccounts();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/accounts");
    expect(JSON.parse(result).items[0].name).toBe("TestCo");
  });
});

describe("auth", () => {
  it("sends Bearer token", async () => {
    mockOk({ items: [] });
    await handleListAccounts();
    const opts = mockFetch.mock.calls[0][1] as RequestInit;
    expect(opts.headers).toHaveProperty("Authorization", "Bearer test-token-123");
  });
});
