import { ITask } from '@/shared/model/task.model';
import { IScientist } from '@/shared/model/scientist.model';

export interface IArea {
  id?: number;
  title?: string | null;
  description?: string | null;
  tasks?: ITask[] | null;
  scientist?: IScientist | null;
}

export class Area implements IArea {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public tasks?: ITask[] | null,
    public scientist?: IScientist | null
  ) {}
}
