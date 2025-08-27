// apps/api/src/routes/roles.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as c from "../controllers/roles.controller";

const r = Router();
r.use(authenticate);

r.get("/", c.list);
r.get("/:id", c.get);
r.post("/", c.create);
r.put("/:id", c.update);
r.delete("/:id", c.remove);

export const rolesRoutes = r;
