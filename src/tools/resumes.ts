import { z } from "zod";
import { hfGet } from "../client.js";

export const getApplicantResumesSchema = z.object({
  account_id: z.number().describe("ID аккаунта HuntFlow"),
  applicant_id: z.number().describe("ID кандидата"),
});

export async function handleGetApplicantResumes(params: z.infer<typeof getApplicantResumesSchema>): Promise<string> {
  const result = await hfGet(`/accounts/${params.account_id}/applicants/${params.applicant_id}/externals`);
  return JSON.stringify(result, null, 2);
}
