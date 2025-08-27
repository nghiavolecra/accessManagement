// accessRequests.routes.ts
import { Router } from "express";
import { list, get, create, update, remove, approve, reject } from "../controllers/accessRequests.controller";

const router = Router();

// KHÔNG thêm /access-requests nữa, vì app.ts đã prefix rồi
router.get("/", list);
router.get("/:id", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);
router.put("/:id/approve", approve);
router.put("/:id/reject", reject);

export default router;
