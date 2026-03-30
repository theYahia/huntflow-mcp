import { z } from "zod";
import { hfGet } from "../client.js";

export const searchApplicantsSchema = z.object({
  account_id: z.number().describe("ID аккаунта HuntFlow"),
  q: z.string().optional().describe("Поиск по имени или email"),
  count: z.number().int().min(1).max(100).default(30).describe("Количество"),
});

export async function handleSearchApplicants(params: z.infer<typeof searchApplicantsSchema>): Promise<string> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  query.set("count", String(params.count));
  const result = await hfGet(`/accounts/${params.account_id}/applicants?${query.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getApplicantSchema = z.object({
  account_id: z.number().describe("ID аккаунта"),
  applicant_id: z.number().describe("ID кандидата"),
});

export async function handleGetApplicant(params: z.infer<typeof getApplicantSchema>): Promise<string> {
  const result = await hfGet(`/accounts/${params.account_id}/applicants/${params.applicant_id}`);
  return JSON.stringify(result, null, 2);
}
