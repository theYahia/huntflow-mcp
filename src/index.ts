#!/usr/bin/env node

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listVacanciesSchema, handleListVacancies, getVacancySchema, handleGetVacancy } from "./tools/vacancies.js";
import { searchApplicantsSchema, handleSearchApplicants, getApplicantSchema, handleGetApplicant } from "./tools/applicants.js";
import { getApplicantResumesSchema, handleGetApplicantResumes } from "./tools/resumes.js";
import { listStagesSchema, handleListStages } from "./tools/stages.js";
import { listAccountsSchema, handleListAccounts } from "./tools/accounts.js";

export function createServer(): McpServer {
  const server = new McpServer({ name: "huntflow-mcp", version: "1.1.0" });

  // --- Tools (7) ---

  server.tool("list_vacancies", "Список вакансий в HuntFlow.", listVacanciesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleListVacancies(params) }] }));

  server.tool("get_vacancy", "Полная информация о вакансии.", getVacancySchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetVacancy(params) }] }));

  server.tool("search_applicants", "Поиск кандидатов по имени или email.", searchApplicantsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleSearchApplicants(params) }] }));

  server.tool("get_applicant", "Полная информация о кандидате.", getApplicantSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetApplicant(params) }] }));

  server.tool("get_applicant_resumes", "Резюме кандидата (все прикреплённые).", getApplicantResumesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetApplicantResumes(params) }] }));

  server.tool("list_stages", "Этапы воронки подбора (статусы вакансии).", listStagesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleListStages(params) }] }));

  server.tool("list_accounts", "Список доступных аккаунтов HuntFlow.", listAccountsSchema.shape,
    async () => ({ content: [{ type: "text", text: await handleListAccounts() }] }));

  // --- Skills / Prompts (2) ---

  server.prompt("skill-applicants", "Кандидаты на вакансию — показать всех кандидатов, прикреплённых к указанной вакансии.",
    { account_id: z.string().describe("ID аккаунта"), vacancy_id: z.string().describe("ID вакансии") },
    (args) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            `Покажи всех кандидатов на вакансию ${args.vacancy_id} в аккаунте ${args.account_id}.`,
            `Используй инструменты: get_vacancy (account_id=${args.account_id}, vacancy_id=${args.vacancy_id}), затем search_applicants (account_id=${args.account_id}).`,
            `Для каждого кандидата покажи: имя, email, телефон, текущий этап.`,
            `Формат: таблица. В конце — сводка: сколько всего, сколько на каждом этапе.`,
          ].join("\n"),
        },
      }],
    })
  );

  server.prompt("skill-vacancy-stats", "Статистика по вакансии — воронка, сроки, конверсия.",
    { account_id: z.string().describe("ID аккаунта"), vacancy_id: z.string().describe("ID вакансии") },
    (args) => ({
      messages: [{
        role: "user" as const,
        content: {
          type: "text" as const,
          text: [
            `Покажи статистику по вакансии ${args.vacancy_id} в аккаунте ${args.account_id}.`,
            `Используй инструменты: get_vacancy, list_stages, search_applicants.`,
            `Собери: название вакансии, дата создания, сколько дней открыта,`,
            `количество кандидатов на каждом этапе воронки, общая конверсия.`,
            `Формат: сначала карточка вакансии, потом воронка (этап -> кол-во), потом выводы.`,
          ].join("\n"),
        },
      }],
    })
  );

  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const server = createServer();

  if (args.includes("--http")) {
    const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
    const http = await import("node:http");

    const PORT = parseInt(process.env.PORT || "3000", 10);

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    await server.connect(transport);

    const httpServer = http.createServer(async (req, res) => {
      if (req.url === "/mcp") {
        await transport.handleRequest(req, res);
      } else if (req.method === "GET" && req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", tools: 7, prompts: 2 }));
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    httpServer.listen(PORT, () => {
      console.error(`[huntflow-mcp] HTTP сервер на порту ${PORT}. POST /mcp, GET /health`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[huntflow-mcp] Сервер запущен (stdio). 7 инструментов, 2 скилла.");
  }
}

main().catch((error) => { console.error("[huntflow-mcp] Ошибка:", error); process.exit(1); });
