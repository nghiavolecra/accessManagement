// apps/api/src/routes/reports.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import * as c from "../controllers/reports.controller";

const r = Router();
r.use(authenticate);
r.get("/access-summary", authorize("Admin", "Manager"), c.accessSummary);

// was: export default r;
export const reportsRoutes = r;  // <-- named export
