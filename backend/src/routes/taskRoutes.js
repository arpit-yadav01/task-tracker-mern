const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

// POST → Create task
router.post("/", createTask);

// GET → All tasks
router.get("/", getAllTasks);

// PUT → Update task
router.put("/:id", updateTask);

// DELETE → Delete task
router.delete("/:id", deleteTask);

module.exports = router;
