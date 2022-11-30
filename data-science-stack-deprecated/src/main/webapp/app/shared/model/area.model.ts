import { ITask } from 'app/shared/model/task.model';
import { IScientist } from 'app/shared/model/scientist.model';

export interface IArea {
  id?: number;
  title?: string | null;
  description?: string | null;
  tasks?: ITask[] | null;
  scientist?: IScientist | null;
}

export const defaultValue: Readonly<IArea> = {};
