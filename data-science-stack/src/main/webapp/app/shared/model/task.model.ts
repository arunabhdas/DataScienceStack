import { IArea } from '@/shared/model/area.model';

export interface ITask {
  id?: number;
  title?: string | null;
  description?: string | null;
  areas?: IArea[] | null;
}

export class Task implements ITask {
  constructor(public id?: number, public title?: string | null, public description?: string | null, public areas?: IArea[] | null) {}
}
