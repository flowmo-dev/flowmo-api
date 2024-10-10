import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';
import { FocusSession } from './FocusSession';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => FocusSession, (focusSession) => focusSession.user)
  focusSessions: FocusSession[];
}