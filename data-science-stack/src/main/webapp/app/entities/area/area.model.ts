import { ITask } from 'app/entities/task/task.model';
import { IScientist } from 'app/entities/scientist/scientist.model';

export interface IArea {
  id: number;
  title?: string | null;
  description?: string | null;
  tasks?: Pick<ITask, 'id' | 'title'>[] | null;
  scientist?: Pick<IScientist, 'id'> | null;
}

export type NewArea = Omit<IArea, 'id'> & { id: null };
