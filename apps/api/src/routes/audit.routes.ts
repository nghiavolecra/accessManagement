// apps/api/src/routes/audit.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as c from "../controllers/audit.controller";

const r = Router();
r.use(authenticate);

// examples
r.get("/", c.list);
r.get("/:id", c.get);

export const auditRoutes = r; // <-- named export
