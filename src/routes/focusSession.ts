import express from 'express';
import { getRepository, Between } from 'typeorm';
import { FocusSession } from '../entities/FocusSession';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const focusSessionRepository = getRepository(FocusSession);

    let whereClause: any = { user: { id: (req as any).user.id } };

    if (startDate && endDate) {
      whereClause.date = Between(new Date(startDate as string), new Date(endDate as string));
    }

    const focusSessions = await focusSessionRepository.find({
      where: whereClause,
      relations: ['task'],
    });

    return res.json(focusSessions);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching focus sessions' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { taskId, duration, date, records } = req.body;
    const focusSessionRepository = getRepository(FocusSession);

    const newFocusSession = focusSessionRepository.create({
      duration,
      date: new Date(date),
      user: { id: (req as any).user.id },
      task: { id: taskId },
      records
    });

    await focusSessionRepository.save(newFocusSession);
    return res.status(201).json(newFocusSession);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating focus session' });
  }
});

export const focusSessionRouter = router;
