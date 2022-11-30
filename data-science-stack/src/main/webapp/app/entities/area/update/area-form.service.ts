import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IArea, NewArea } from '../area.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IArea for edit and NewAreaFormGroupInput for create.
 */
type AreaFormGroupInput = IArea | PartialWithRequiredKeyOf<NewArea>;

type AreaFormDefaults = Pick<NewArea, 'id' | 'tasks'>;

type AreaFormGroupContent = {
  id: FormControl<IArea['id'] | NewArea['id']>;
  title: FormControl<IArea['title']>;
  description: FormControl<IArea['description']>;
  tasks: FormControl<IArea['tasks']>;
  scientist: FormControl<IArea['scientist']>;
};

export type AreaFormGroup = FormGroup<AreaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AreaFormService {
  createAreaFormGroup(area: AreaFormGroupInput = { id: null }): AreaFormGroup {
    const areaRawValue = {
      ...this.getFormDefaults(),
      ...area,
    };
    return new FormGroup<AreaFormGroupContent>({
      id: new FormControl(
        { value: areaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(areaRawValue.title),
      description: new FormControl(areaRawValue.description),
      tasks: new FormControl(areaRawValue.tasks ?? []),
      scientist: new FormControl(areaRawValue.scientist),
    });
  }

  getArea(form: AreaFormGroup): IArea | NewArea {
    return form.getRawValue() as IArea | NewArea;
  }

  resetForm(form: AreaFormGroup, area: AreaFormGroupInput): void {
    const areaRawValue = { ...this.getFormDefaults(), ...area };
    form.reset(
      {
        ...areaRawValue,
        id: { value: areaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AreaFormDefaults {
    return {
      id: null,
      tasks: [],
    };
  }
}
