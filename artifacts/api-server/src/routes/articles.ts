import { Router, type IRouter, type Request, type Response } from "express";
import { eq, count } from "drizzle-orm";
import { db, articlesTable, insertArticleSchema, updateArticleSchema } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

router.get("/articles", async (req: Request, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters", details: parsed.error.format() });
    return;
  }
  const { limit, offset } = parsed.data;

  const [articles, totalResult] = await Promise.all([
    db.select().from(articlesTable).limit(limit).offset(offset),
    db.select({ value: count() }).from(articlesTable),
  ]);

  const total = totalResult[0]?.value ?? 0;

  res.json({ articles, total, limit, offset });
});

router.post("/articles", async (req: Request, res: Response) => {
  const parsed = insertArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
    return;
  }

  const now = new Date().toISOString();
  const result = await db
    .insert(articlesTable)
    .values({ ...parsed.data, createdAt: now, updatedAt: now })
    .returning();

  res.status(201).json(result[0]);
});

router.get("/articles/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid article ID" });
    return;
  }

  const rows = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
  const article = rows[0];

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(article);
});

router.put("/articles/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid article ID" });
    return;
  }

  const parsed = updateArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields provided for update" });
    return;
  }

  const existing = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
  if (!existing[0]) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  const updated = await db
    .update(articlesTable)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
    .where(eq(articlesTable.id, id))
    .returning();

  res.json(updated[0]);
});

router.delete("/articles/:id", async (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid article ID" });
    return;
  }

  const existing = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
  if (!existing[0]) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  await db.delete(articlesTable).where(eq(articlesTable.id, id));

  res.status(204).send();
});

export default router;
