#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listVacanciesSchema, handleListVacancies, getVacancySchema, handleGetVacancy } from "./tools/vacancies.js";
import { searchApplicantsSchema, handleSearchApplicants, getApplicantSchema, handleGetApplicant } from "./tools/applicants.js";

const server = new McpServer({ name: "huntflow-mcp", version: "1.0.0" });

server.tool("list_vacancies", "Список вакансий в HuntFlow.", listVacanciesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListVacancies(params) }] }));

server.tool("get_vacancy", "Полная информация о вакансии.", getVacancySchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetVacancy(params) }] }));

server.tool("search_applicants", "Поиск кандидатов по имени или email.", searchApplicantsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSearchApplicants(params) }] }));

server.tool("get_applicant", "Полная информация о кандидате.", getApplicantSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetApplicant(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[huntflow-mcp] Сервер запущен. 4 инструмента.");
}

main().catch((error) => { console.error("[huntflow-mcp] Ошибка:", error); process.exit(1); });
