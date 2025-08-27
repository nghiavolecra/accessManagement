import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import express, { type RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/env"; // openapi specs loader
import { authRoutes } from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import { rolesRoutes } from "./routes/roles.routes";
import { resourcesRoutes } from "./routes/resources.routes";
import accessReqRoutes from "./routes/accessRequests.routes";
import { auditRoutes } from "./routes/audit.routes";
import { reportsRoutes } from "./routes/reports.routes";
import { errorHandler } from "./middleware/errorHandler";
import dashboardRoutes from "./routes/dashboard.routes";
const swaggerServe = swaggerUi.serve as unknown as RequestHandler;
const swaggerSetup = swaggerUi.setup(specs) as unknown as RequestHandler;
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));
app.use("/docs", swaggerServe, swaggerSetup);

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
}) as unknown as RequestHandler;

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/access-requests", accessReqRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);
export default app;