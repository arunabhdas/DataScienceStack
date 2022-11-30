import { IArea } from 'app/shared/model/area.model';

export interface ITask {
  id?: number;
  title?: string | null;
  description?: string | null;
  areas?: IArea[] | null;
}

export const defaultValue: Readonly<ITask> = {};
