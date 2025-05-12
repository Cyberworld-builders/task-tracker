import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTaskSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Middleware to ensure user is authenticated
function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Task routes
  app.get("/api/tasks", ensureAuthenticated, async (req, res) => {
    const tasks = await storage.getTasks(req.user!.id);
    res.json(tasks);
  });

  app.post("/api/tasks", ensureAuthenticated, async (req, res, next) => {
    try {
      const taskData = insertTaskSchema
        .omit({ userId: true })
        .parse(req.body);

      const task = await storage.createTask({
        ...taskData,
        userId: req.user!.id,
      });

      res.status(201).json(task);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        next(error);
      }
    }
  });

  app.patch("/api/tasks/:id", ensureAuthenticated, async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to modify this task" });
      }

      const updatedTask = await storage.updateTask(taskId, req.body);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", ensureAuthenticated, async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      if (isNaN(taskId)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.userId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to delete this task" });
      }

      await storage.deleteTask(taskId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
