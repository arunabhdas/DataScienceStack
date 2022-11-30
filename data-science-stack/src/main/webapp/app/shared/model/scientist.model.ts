import { IArea } from '@/shared/model/area.model';
import { IDepartment } from '@/shared/model/department.model';

export interface IScientist {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  startDate?: Date | null;
  salary?: number | null;
  percentage?: number | null;
  areas?: IArea[] | null;
  department?: IDepartment | null;
}

export class Scientist implements IScientist {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public startDate?: Date | null,
    public salary?: number | null,
    public percentage?: number | null,
    public areas?: IArea[] | null,
    public department?: IDepartment | null
  ) {}
}
