import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IScientist, NewScientist } from '../scientist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IScientist for edit and NewScientistFormGroupInput for create.
 */
type ScientistFormGroupInput = IScientist | PartialWithRequiredKeyOf<NewScientist>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IScientist | NewScientist> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

type ScientistFormRawValue = FormValueOf<IScientist>;

type NewScientistFormRawValue = FormValueOf<NewScientist>;

type ScientistFormDefaults = Pick<NewScientist, 'id' | 'startDate'>;

type ScientistFormGroupContent = {
  id: FormControl<ScientistFormRawValue['id'] | NewScientist['id']>;
  firstName: FormControl<ScientistFormRawValue['firstName']>;
  lastName: FormControl<ScientistFormRawValue['lastName']>;
  email: FormControl<ScientistFormRawValue['email']>;
  phoneNumber: FormControl<ScientistFormRawValue['phoneNumber']>;
  startDate: FormControl<ScientistFormRawValue['startDate']>;
  salary: FormControl<ScientistFormRawValue['salary']>;
  percentage: FormControl<ScientistFormRawValue['percentage']>;
  department: FormControl<ScientistFormRawValue['department']>;
};

export type ScientistFormGroup = FormGroup<ScientistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ScientistFormService {
  createScientistFormGroup(scientist: ScientistFormGroupInput = { id: null }): ScientistFormGroup {
    const scientistRawValue = this.convertScientistToScientistRawValue({
      ...this.getFormDefaults(),
      ...scientist,
    });
    return new FormGroup<ScientistFormGroupContent>({
      id: new FormControl(
        { value: scientistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(scientistRawValue.firstName),
      lastName: new FormControl(scientistRawValue.lastName),
      email: new FormControl(scientistRawValue.email),
      phoneNumber: new FormControl(scientistRawValue.phoneNumber),
      startDate: new FormControl(scientistRawValue.startDate),
      salary: new FormControl(scientistRawValue.salary),
      percentage: new FormControl(scientistRawValue.percentage),
      department: new FormControl(scientistRawValue.department),
    });
  }

  getScientist(form: ScientistFormGroup): IScientist | NewScientist {
    return this.convertScientistRawValueToScientist(form.getRawValue() as ScientistFormRawValue | NewScientistFormRawValue);
  }

  resetForm(form: ScientistFormGroup, scientist: ScientistFormGroupInput): void {
    const scientistRawValue = this.convertScientistToScientistRawValue({ ...this.getFormDefaults(), ...scientist });
    form.reset(
      {
        ...scientistRawValue,
        id: { value: scientistRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ScientistFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
    };
  }

  private convertScientistRawValueToScientist(rawScientist: ScientistFormRawValue | NewScientistFormRawValue): IScientist | NewScientist {
    return {
      ...rawScientist,
      startDate: dayjs(rawScientist.startDate, DATE_TIME_FORMAT),
    };
  }

  private convertScientistToScientistRawValue(
    scientist: IScientist | (Partial<NewScientist> & ScientistFormDefaults)
  ): ScientistFormRawValue | PartialWithRequiredKeyOf<NewScientistFormRawValue> {
    return {
      ...scientist,
      startDate: scientist.startDate ? scientist.startDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
