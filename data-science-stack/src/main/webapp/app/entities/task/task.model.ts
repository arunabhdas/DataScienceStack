import { IArea } from 'app/entities/area/area.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  areas?: Pick<IArea, 'id'>[] | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
