import { IArea, NewArea } from './area.model';

export const sampleWithRequiredData: IArea = {
  id: 11565,
};

export const sampleWithPartialData: IArea = {
  id: 2673,
};

export const sampleWithFullData: IArea = {
  id: 33154,
  title: 'Towels Administrator',
  description: 'Chips Ball',
};

export const sampleWithNewData: NewArea = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
