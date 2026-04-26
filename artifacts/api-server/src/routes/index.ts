import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import adminRouter from "./admin";
import contentRouter from "./content";
import uploadsRouter from "./uploads";
import projectsRouter from "./projects";
import servicesRouter from "./services";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(adminRouter);
router.use(contentRouter);
router.use(uploadsRouter);
router.use(projectsRouter);
router.use(servicesRouter);

export default router;
