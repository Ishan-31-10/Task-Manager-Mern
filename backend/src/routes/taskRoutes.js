import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// All task routes are protected
router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
