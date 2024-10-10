import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { authRouter } from './routes/auth';
import { taskRouter } from './routes/task';
import { focusSessionRouter } from './routes/focusSession';
import { User } from './entities/User';
import { Task } from './entities/Task';
import { FocusSession } from './entities/FocusSession';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/focus-sessions', focusSessionRouter);

createConnection({
  type: 'sqlite',
  database: process.env.DB_NAME || 'flowmodoro.sqlite',
  entities: [User, Task, FocusSession],
  synchronize: true,
  logging: true,
})
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('TypeORM connection error: ', error));