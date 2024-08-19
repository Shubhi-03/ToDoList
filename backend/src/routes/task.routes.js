import { Router } from "express";
import { addTask, createList, deleteTask, getList, updateList, updateTask } from "../controllers/task.controller.js";
import requireAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/list").post(createList);
router.route('/:listId').post( addTask);
router.route("/getlist").get( getList);
router.route('/update/:taskId').post(updateTask)
router.route('/updateList/:listId').post(updateList)
router.route('/delete/:listId').post(deleteTask)

export default router;