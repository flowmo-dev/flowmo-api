import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity()
export class FocusSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.focusSessions)
  user: User;

  @ManyToOne(() => Task, (task) => task.focusSessions)
  task: Task;
}