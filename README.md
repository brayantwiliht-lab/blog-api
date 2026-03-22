# blog-api

A Node.js Express REST API for a blog with full CRUD operations for articles, backed by SQLite.

## Stack

- **Runtime**: Node.js 24
- **Framework**: Express 5
- **Database**: SQLite via `@libsql/client` + Drizzle ORM
- **Validation**: Zod + drizzle-zod
- **Language**: TypeScript
- **Monorepo**: pnpm workspaces
- **API spec**: OpenAPI 3.1 + Orval codegen

## Project Structure

```
├── artifacts/api-server/   # Express API server
├── lib/db/                 # Drizzle ORM schema + SQLite connection
├── lib/api-spec/           # OpenAPI spec + codegen config
├── lib/api-zod/            # Generated Zod schemas
└── lib/api-client-react/   # Generated React Query hooks
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| GET | `/api/articles` | List articles (`?limit=20&offset=0`) |
| POST | `/api/articles` | Create an article |
| GET | `/api/articles/:id` | Get a single article |
| PUT | `/api/articles/:id` | Update an article (partial update) |
| DELETE | `/api/articles/:id` | Delete an article (returns 204) |

## Article Schema

```json
{
  "id": 1,
  "title": "My Post",
  "content": "Post body...",
  "author": "Jane Doe",
  "published": true,
  "createdAt": "2026-03-22T17:00:00.000Z",
  "updatedAt": "2026-03-22T17:00:00.000Z"
}
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the dev server
pnpm --filter @workspace/api-server run dev
```

The SQLite database file (`blog.db`) is created automatically on first run. Override its location with the `SQLITE_DB_PATH` environment variable.

## Codegen

After editing `lib/api-spec/openapi.yaml`, regenerate types and hooks:

```bash
pnpm --filter @workspace/api-spec run codegen
```

