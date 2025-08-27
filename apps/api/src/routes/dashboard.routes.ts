import { Router } from "express";
import { summary } from "../controllers/dashboard.controller";
// Nếu muốn bảo vệ bằng JWT thì import authenticate và dùng r.use(authenticate);

const r = Router();
r.get("/summary", summary);

export default r;
