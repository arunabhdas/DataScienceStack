import dayjs from 'dayjs';
import { IArea } from 'app/shared/model/area.model';
import { IDepartment } from 'app/shared/model/department.model';

export interface IScientist {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  startDate?: string | null;
  salary?: number | null;
  percentage?: number | null;
  areas?: IArea[] | null;
  department?: IDepartment | null;
}

export const defaultValue: Readonly<IScientist> = {};
