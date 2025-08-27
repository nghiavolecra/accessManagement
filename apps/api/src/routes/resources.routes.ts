// apps/api/src/routes/resources.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as c from "../controllers/resources.controller";

const r = Router();
r.use(authenticate);

r.get("/", c.list);
r.get("/:id", c.get);
r.post("/", c.create);
r.put("/:id", c.update);
r.delete("/:id", c.remove);

export const resourcesRoutes = r;
