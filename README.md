# @theyahia/huntflow-mcp

MCP-сервер для HuntFlow ATS API — вакансии, кандидаты, резюме, этапы, аккаунты. **7 инструментов, 2 скилла.**

[![npm](https://img.shields.io/npm/v/@theyahia/huntflow-mcp)](https://www.npmjs.com/package/@theyahia/huntflow-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов).

## Установка

### Claude Desktop (stdio)
```json
{
  "mcpServers": {
    "huntflow": {
      "command": "npx",
      "args": ["-y", "@theyahia/huntflow-mcp"],
      "env": { "HUNTFLOW_TOKEN": "ваш-токен" }
    }
  }
}
```

### Streamable HTTP
```bash
HUNTFLOW_TOKEN=ваш-токен npx @theyahia/huntflow-mcp --http
# POST /mcp, GET /health на порту 3000 (PORT=...)
```

### Smithery
```bash
npx @smithery/cli install @theyahia/huntflow-mcp
```

## Переменные окружения

| Переменная | Обязательная | Описание |
|------------|:---:|----------|
| `HUNTFLOW_TOKEN` | да | API токен (Настройки → API) |
| `HUNTFLOW_BASE_URL` | нет | По умолчанию `https://api.huntflow.ru/v2` |
| `PORT` | нет | Порт HTTP-сервера (по умолчанию 3000) |

## Инструменты (7)

| Инструмент | Описание |
|------------|----------|
| `list_accounts` | Список доступных аккаунтов |
| `list_vacancies` | Список вакансий (открытые/все) |
| `get_vacancy` | Полная информация о вакансии |
| `search_applicants` | Поиск кандидатов по имени/email |
| `get_applicant` | Полная информация о кандидате |
| `get_applicant_resumes` | Резюме кандидата (все прикреплённые) |
| `list_stages` | Этапы воронки подбора |

## Скиллы (Prompts)

| Скилл | Описание |
|-------|----------|
| `skill-applicants` | Кандидаты на вакансию — таблица с этапами и сводкой |
| `skill-vacancy-stats` | Статистика по вакансии — воронка, сроки, конверсия |

## Разработка

```bash
npm install
npm test           # vitest
npm run dev        # tsx src/index.ts
npm run build      # tsc
```

## Лицензия
MIT
