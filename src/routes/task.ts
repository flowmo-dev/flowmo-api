import express from 'express';
import { getRepository } from 'typeorm';
import { Task } from '../entities/Task';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository.find({ where: { user: { id: (req as any).user.id } } });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const taskRepository = getRepository(Task);
    const newTask = taskRepository.create({ name, user: { id: (req as any).user.id } });
    await taskRepository.save(newTask);
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOne({
      where: { id: parseInt(req.params.id), user: { id: (req as any).user.id } },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await taskRepository.remove(task);
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting task' });
  }
});

export const taskRouter = router;