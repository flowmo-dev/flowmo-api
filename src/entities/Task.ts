import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { FocusSession } from './FocusSession';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => FocusSession, (focusSession) => focusSession.task)
  focusSessions: FocusSession[];
}