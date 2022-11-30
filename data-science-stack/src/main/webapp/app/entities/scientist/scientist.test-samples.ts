import dayjs from 'dayjs/esm';

import { IScientist, NewScientist } from './scientist.model';

export const sampleWithRequiredData: IScientist = {
  id: 37111,
};

export const sampleWithPartialData: IScientist = {
  id: 47540,
  lastName: 'Ruecker',
  phoneNumber: 'end-to-end virtual Planner',
  startDate: dayjs('2022-11-30T03:44'),
  salary: 84003,
  percentage: 7706,
};

export const sampleWithFullData: IScientist = {
  id: 99410,
  firstName: 'Lambert',
  lastName: 'Lind',
  email: 'Royal_Waelchi30@gmail.com',
  phoneNumber: 'Virginia Checking Chicken',
  startDate: dayjs('2022-11-30T04:10'),
  salary: 15032,
  percentage: 79653,
};

export const sampleWithNewData: NewScientist = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
