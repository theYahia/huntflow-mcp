import { z } from "zod";
import { hfGet } from "../client.js";

export const listVacanciesSchema = z.object({
  account_id: z.number().describe("ID аккаунта HuntFlow"),
  opened: z.boolean().default(true).describe("Только открытые вакансии"),
  count: z.number().int().min(1).max(100).default(30).describe("Количество"),
});

export async function handleListVacancies(params: z.infer<typeof listVacanciesSchema>): Promise<string> {
  const query = new URLSearchParams();
  if (params.opened) query.set("opened", "true");
  query.set("count", String(params.count));
  const result = await hfGet(`/accounts/${params.account_id}/vacancies?${query.toString()}`);
  return JSON.stringify(result, null, 2);
}

export const getVacancySchema = z.object({
  account_id: z.number().describe("ID аккаунта"),
  vacancy_id: z.number().describe("ID вакансии"),
});

export async function handleGetVacancy(params: z.infer<typeof getVacancySchema>): Promise<string> {
  const result = await hfGet(`/accounts/${params.account_id}/vacancies/${params.vacancy_id}`);
  return JSON.stringify(result, null, 2);
}
