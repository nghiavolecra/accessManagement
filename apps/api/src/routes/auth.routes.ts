// apps/api/src/routes/auth.routes.ts
import { Router } from "express";
import * as c from "../controllers/auth.controller";

const r = Router();

r.post("/login", c.login);
r.post("/register", c.register);
r.post("/refresh", c.refresh);
r.post("/logout", c.logout);

export const authRoutes = r;
