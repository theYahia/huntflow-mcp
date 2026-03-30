# @theyahia/huntflow-mcp

MCP-сервер для HuntFlow ATS API — вакансии и кандидаты для рекрутинга. **4 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/huntflow-mcp)](https://www.npmjs.com/package/@theyahia/huntflow-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов).

## Установка

### Claude Desktop
```json
{ "mcpServers": { "huntflow": { "command": "npx", "args": ["-y", "@theyahia/huntflow-mcp"], "env": { "HUNTFLOW_TOKEN": "ваш-токен" } } } }
```

| Переменная | Описание |
|------------|----------|
| `HUNTFLOW_TOKEN` | API токен (Настройки → API) |

## Инструменты (4)

| Инструмент | Описание |
|------------|----------|
| `list_vacancies` | Список вакансий (открытые/все) |
| `get_vacancy` | Полная информация о вакансии |
| `search_applicants` | Поиск кандидатов |
| `get_applicant` | Полная информация о кандидате |

## Лицензия
MIT
