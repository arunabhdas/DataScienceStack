import { ILocation } from '@/shared/model/location.model';
import { IScientist } from '@/shared/model/scientist.model';

export interface IDepartment {
  id?: number;
  departmentName?: string;
  location?: ILocation | null;
  scientists?: IScientist[] | null;
}

export class Department implements IDepartment {
  constructor(
    public id?: number,
    public departmentName?: string,
    public location?: ILocation | null,
    public scientists?: IScientist[] | null
  ) {}
}
