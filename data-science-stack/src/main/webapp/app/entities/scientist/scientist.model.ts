import dayjs from 'dayjs/esm';
import { IDepartment } from 'app/entities/department/department.model';

export interface IScientist {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  startDate?: dayjs.Dayjs | null;
  salary?: number | null;
  percentage?: number | null;
  department?: Pick<IDepartment, 'id'> | null;
}

export type NewScientist = Omit<IScientist, 'id'> & { id: null };
