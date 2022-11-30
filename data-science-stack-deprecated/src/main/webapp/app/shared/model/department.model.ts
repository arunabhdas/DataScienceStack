import { ILocation } from 'app/shared/model/location.model';
import { IScientist } from 'app/shared/model/scientist.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  location?: ILocation | null;
  scientists?: IScientist[] | null;
}

export const defaultValue: Readonly<IDepartment> = {};
